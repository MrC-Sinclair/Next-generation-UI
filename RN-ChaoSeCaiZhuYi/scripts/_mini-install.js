/**
 * 迷你包安装器（仅用于在本沙箱内把构建依赖装齐）
 * 特点：全程只"新建"文件，不删除、不修改已有文件 —— 这是当前环境的硬约束。
 * 用法：node scripts/_mini-install.js <项目目录>
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const {execFileSync} = require('child_process');

const REG = 'https://registry.npmmirror.com';
const AGENT = new https.Agent({keepAlive: true, maxSockets: 12});
const ACCEPT = 'application/vnd.npm.install-v1+json';

const ROOT = path.resolve(process.argv[2] || '.');
const NM = path.join(ROOT, 'node_modules');
const PACKS = path.join(ROOT, '.packs');

function get(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    https
      .get(url, {agent: AGENT, headers: {'user-agent': 'pnpm/9', accept: ACCEPT}}, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 5) {
          res.resume();
          return resolve(get(res.headers.location, redirects + 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error('HTTP ' + res.statusCode + ' ' + url));
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

const parts = v => String(v).split(/[.+-]/).slice(0, 3).map(n => parseInt(n, 10) || 0);
const cmp = (a, b) => {
  const [A, B] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) if (A[i] !== B[i]) return A[i] - B[i];
  return 0;
};

function satisfies(version, range) {
  if (!range || range === '*' || range === 'latest' || range === 'x') return true;
  if (range.includes('||')) return range.split('||').some(r => satisfies(version, r.trim()));
  if (range.startsWith('workspace:')) return false;
  const r = range.trim().replace(/^[^\d]*/, '');
  if (!r) return true;
  const [M, m, p] = parts(version);
  const [rM, rm = 0, rp = 0] = r.split('.').map(n => parseInt(n, 10) || 0);
  if (range.startsWith('^')) {
    if (M !== rM) return false;
    if (m !== rm) return m > rm;
    return p >= rp;
  }
  if (range.startsWith('~')) return M === rM && m === rm && p >= rp;
  if (range.startsWith('>=')) return cmp(version, r) >= 0;
  return cmp(version, r) === 0;
}

const packumentCache = new Map();
async function packument(name) {
  if (packumentCache.has(name)) return packumentCache.get(name);
  const p = get(`${REG}/${name.replace('/', '%2F')}`).then(b => JSON.parse(b.toString()));
  packumentCache.set(name, p);
  return p;
}

async function resolveVersion(name, range) {
  const doc = await packument(name);
  const versions = Object.keys(doc.versions || {}).filter(
    v => !v.includes('-') && !(doc.versions[v].deprecated && false) && satisfies(v, range),
  );
  if (!versions.length) {
    const all = Object.keys(doc.versions || {});
    all.sort(cmp);
    return all[all.length - 1];
  }
  versions.sort(cmp);
  return versions[versions.length - 1];
}

const installed = new Map(); // name -> version
const queue = [];
const seen = new Set();

function dest(name) {
  return path.join(NM, name);
}

function already(name) {
  const pj = path.join(dest(name), 'package.json');
  if (!fs.existsSync(pj)) return null;
  try {
    return JSON.parse(fs.readFileSync(pj, 'utf8')).version;
  } catch (e) {
    return null;
  }
}

async function installOne(name, range) {
  const key = name + '@' + range;
  if (seen.has(key)) return;
  seen.add(key);

  const cur = already(name);
  if (cur && satisfies(cur, range)) return;

  const version = await resolveVersion(name, range);
  if (cur === version) return;

  const doc = await packument(name);
  const tarball = doc.versions[version].dist.tarball;
  const safe = name.replace('/', '-');
  const file = path.join(PACKS, `${safe}.tgz`);
  fs.mkdirSync(PACKS, {recursive: true});

  let buf;
  for (let i = 0; i < 3; i++) {
    try {
      buf = await get(tarball);
      break;
    } catch (e) {
      if (i === 2) throw e;
    }
  }
  fs.writeFileSync(file, buf);

  const outDir = path.join(PACKS, 'x_' + safe);
  fs.mkdirSync(outDir, {recursive: true});
  execFileSync('tar', ['-xzf', path.basename(file), '-C', path.basename(outDir)], {
    cwd: PACKS,
    stdio: 'ignore',
  });

  const target = dest(name);
  fs.mkdirSync(target, {recursive: true});
  fs.cpSync(path.join(outDir, 'package'), target, {recursive: true, force: false});

  console.log(`  + ${name}@${version}`);

  const pkg = doc.versions[version];
  const deps = pkg.dependencies || {};
  for (const [dn, dr] of Object.entries(deps)) queue.push([dn, dr]);
}

async function main() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  fs.mkdirSync(NM, {recursive: true});

  for (const [n, r] of Object.entries({...pkg.dependencies, ...pkg.devDependencies})) queue.push([n, r]);

  let guard = 0;
  while (queue.length && guard++ < 5000) {
    const batch = queue.splice(0, 10);
    await Promise.all(
      batch.map(async ([n, r]) => {
        try {
          await installOne(n, r);
        } catch (e) {
          console.log(`  ! ${n}@${r} -> ${String(e.message).slice(0, 80)}`);
        }
      }),
    );
  }
  console.log('完成，共安装目录：' + fs.readdirSync(NM).length);
}

main().catch(e => {
  console.error('FATAL', e);
  process.exit(1);
});
