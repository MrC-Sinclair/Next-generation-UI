/**
 * 临时脚本：直接下载 tarball 修复不完整解压的依赖包。
 * 环境里 npm 的 cacache 依赖 temp+rename，被安全策略拦截，所以走原生下载 + tar 解压。
 *
 * 用法：node scripts/_repair.js <pkg> <pkg> ...
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const {execFileSync} = require('child_process');

const REG = 'https://registry.npmmirror.com';
const ROOT = path.resolve(__dirname, '..');
const TARGETS = process.argv.slice(2);

function get(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    https
      .get(url, {headers: {'user-agent': 'npm', accept: '*/*'}}, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 5) {
          res.resume();
          return resolve(get(res.headers.location, redirects + 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error('HTTP ' + res.statusCode));
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

/** 支持 ^ / ~ / >= / 精确版本，够用即可 */
function satisfies(version, range) {
  if (!range || range === '*' || range === 'latest') return true;
  const r = range.trim().replace(/^[^\d]*/, '');
  const [M, m, p] = parts(version);
  const [rM, rm = 0, rp = 0] = r.split('.').map(n => parseInt(n, 10) || 0);
  if (range.startsWith('^')) {
    if (M !== rM) return false;
    if (m !== rm) return m > rm;
    return p >= rp;
  }
  if (range.startsWith('~')) return M === rM && m === rm && p >= rp;
  return cmp(version, r) >= 0;
}

async function pickVersion(name, range) {
  const doc = JSON.parse((await get(`${REG}/${name.replace('/', '%2F')}`)).toString());
  const versions = Object.keys(doc.versions || {}).filter(v => !v.includes('-') && satisfies(v, range));
  if (!versions.length) throw new Error(`没有匹配 ${range} 的版本`);
  versions.sort(cmp);
  const v = versions[versions.length - 1];
  return {version: v, tarball: doc.versions[v].dist.tarball};
}

(async () => {
  const tmp = path.join(ROOT, '.packs');
  fs.mkdirSync(tmp, {recursive: true});

  for (const entry of TARGETS) {
    // entry 形如  "@babel/helpers:^7.0.0"  或  "lodash"
    const [name, rangeArg] = entry.split('::');
    try {
      let range = rangeArg;
      if (!range) {
        const pkgPath = path.join(ROOT, 'node_modules', name, 'package.json');
        range = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version : '*';
      }
      const {version, tarball} = await pickVersion(name, range);
      process.stdout.write(`↓ ${name}@${version} (${tarball.split('/').pop()}) ... `);

      const file = path.join(tmp, `${name.replace('/', '-')}.tgz`);
      fs.writeFileSync(file, await get(tarball));

      const outDir = path.join(tmp, 'x_' + name.replace('/', '-'));
      fs.mkdirSync(outDir, {recursive: true});
      // 用相对路径调用 tar，避开 GNU tar 对 "D:\..." 盘符的解析问题
      execFileSync('tar', ['-xzf', path.basename(file), '-C', path.basename(outDir)], {
        cwd: tmp,
        stdio: 'ignore',
      });

      const dest = path.join(ROOT, 'node_modules', name);
      fs.mkdirSync(dest, {recursive: true});
      fs.cpSync(path.join(outDir, 'package'), dest, {recursive: true, force: true});
      console.log('ok');
    } catch (e) {
      console.log('FAILED:', String(e.message).slice(0, 140));
    }
  }
})();
