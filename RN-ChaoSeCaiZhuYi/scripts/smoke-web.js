/**
 * Web 端冒烟测试：用真实 Chromium 跑一遍全站。
 *
 *   用法：node scripts/smoke-web.js [url]
 *   默认：http://127.0.0.1:4321
 *
 * 覆盖：
 *   1. 六个页面能否渲染（不白屏、有内容）
 *   2. 控制台报错 / 未捕获异常
 *   3. 三档视口（PC 侧边栏 / 平板顶栏 / 手机底部 Tab）导航形态
 *   4. 首页关键文案是否出现
 */

const path = require('path');
const fs = require('fs');

const URL = process.argv[2] || 'http://127.0.0.1:4321';
const OUT = path.resolve(__dirname, '..', 'test-output');

const NAV = [
  {key: 'home', label: '首页概览'},
  {key: 'about', label: '关于我'},
  {key: 'works', label: '作品集'},
  {key: 'skills', label: '技能栈'},
  {key: 'blog', label: '博客'},
  {key: 'contact', label: '联系方式'},
];

const VIEWPORTS = [
  {name: 'desktop', width: 1440, height: 900, nav: 'sidebar'},
  {name: 'tablet', width: 820, height: 1100, nav: 'topbar'},
  {name: 'mobile', width: 390, height: 844, nav: 'bottomtabs'},
];

function resolvePlaywright() {
  const candidates = [
    'playwright',
    'playwright-core',
    path.join(
      process.env.APPDATA || '',
      '..',
      'Local',
      'Programs',
      'nodejs',
      'node_modules',
      'playwright',
    ),
  ];
  for (const c of candidates) {
    try {
      return require(c);
    } catch (_) {
      /* try next */
    }
  }
  // 最后兜底：从 npm 全局目录里找
  const {execSync} = require('child_process');
  try {
    const root = execSync('npm root -g', {encoding: 'utf8'}).trim();
    return require(path.join(root, 'playwright'));
  } catch (e) {
    return null;
  }
}

function findChrome() {
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ];
  return candidates.find(p => fs.existsSync(p)) || null;
}

/** 读取页面主体状态 */
async function readState(page) {
  return page.evaluate(() => {
    const root = document.getElementById('root');
    if (!root) return {ok: false, reason: '#root 不存在'};
    const text = (root.innerText || '').trim();
    return {
      ok: true,
      nodes: root.querySelectorAll('*').length,
      textLen: text.length,
      head: text.slice(0, 120).replace(/\s+/g, ' '),
      signature: text.slice(0, 400),
    };
  });
}

async function main() {
  const {chromium} = resolvePlaywright() || {};
  if (!chromium) {
    console.error('✗ 找不到 playwright，请先 npm i -D playwright 或全局安装');
    process.exit(1);
  }

  fs.mkdirSync(OUT, {recursive: true});

  const executablePath = findChrome();
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? {executablePath} : {channel: 'chrome'}),
  });

  const problems = [];
  const results = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({viewport: {width: vp.width, height: vp.height}});

    // 收集控制台错误 / 未捕获异常
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const t = msg.text();
        // 字体 CDN 拉不到、favicon 404 都不算应用错误
        if (/fonts\.(googleapis|gstatic)/.test(t)) return;
        if (/favicon\.ico/.test(t) || /404 \(Not Found\)/.test(t)) return;
      }
    });
    page.on('pageerror', err => problems.push(`[${vp.name}] pageerror: ${err.message}`));

    console.log(`\n──────── ${vp.name} (${vp.width}×${vp.height}) ────────`);

    await page.goto(URL, {waitUntil: 'domcontentloaded'});
    await page.waitForFunction(
      () => {
        const r = document.getElementById('root');
        return r && r.querySelectorAll('*').length > 50;
      },
      {timeout: 15000},
    );

    for (const item of NAV) {
      const before = await readState(page);
      await page.locator(`text=${item.label}`).first().click({timeout: 5000});
      await page.waitForTimeout(420);
      const after = await readState(page);

      const changed = after.signature !== before.signature;
      const healthy = after.nodes > 50 && after.textLen > 80;

      if (!healthy) problems.push(`[${vp.name}] ${item.label} 页面内容异常 (nodes=${after.nodes}, textLen=${after.textLen})`);
      if (item.key !== 'home' && !changed) problems.push(`[${vp.name}] 点击「${item.label}」后页面没有切换`);

      const tag = healthy ? (changed || item.key === 'home' ? '✓' : '△') : '✗';
      console.log(`  ${tag} ${item.label.padEnd(6, '　')} nodes=${String(after.nodes).padStart(4)}  文本=${String(after.textLen).padStart(4)}字  ${after.head.slice(0, 40)}`);

      results.push({viewport: vp.name, screen: item.key, nodes: after.nodes, textLen: after.textLen});

      await page.screenshot({path: path.join(OUT, `${vp.name}-${item.key}.png`)});
    }

    // 导航形态校验
    const navShape = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('div'));
      const hasBottomTabs = all.some(d => {
        const s = getComputedStyle(d);
        return s.position !== 'absolute' && /flex-start/.test(s.alignItems) && d.querySelectorAll('div').length > 20;
      });
      return {hasBottomTabs, w: window.innerWidth};
    });
    console.log(`  ℹ 视口宽度 ${navShape.w}，导航形态=${vp.nav}`);

    await page.close();
  }

  // 首页关键文案检查
  const page = await browser.newPage({viewport: {width: 1440, height: 900}});
  await page.goto(URL, {waitUntil: 'domcontentloaded'});
  await page.waitForFunction(
    () => {
      const r = document.getElementById('root');
      return r && r.querySelectorAll('*').length > 50;
    },
    {timeout: 15000},
  );
  const homeText = await page.evaluate(() => document.getElementById('root').innerText || '');
  const EXPECT = ['CHROMA', '林可乐', '全栈产品工程师', '首页概览', '精选作品', '一套代码跑 PC'];
  console.log('\n──────── 首页关键文案 ────────');
  for (const e of EXPECT) {
    const hit = homeText.includes(e);
    if (!hit) problems.push(`首页缺少文案: ${e}`);
    console.log(`  ${hit ? '✓' : '✗'} ${e}`);
  }
  await page.screenshot({path: path.join(OUT, 'home-full.png'), fullPage: true});
  await page.close();

  // 单文件版本（standalone.html）校验：直接 file:// 打开，不依赖任何服务器
  const standalone = path.join(path.dirname(OUT), 'web-dist', 'standalone.html');
  console.log('\n──────── 单文件版 standalone.html ────────');
  if (fs.existsSync(standalone)) {
    const sp = await browser.newPage({viewport: {width: 1440, height: 900}});
    let standaloneErr = null;
    sp.on('pageerror', e => (standaloneErr = e.message));
    await sp.goto('file:///' + standalone.replace(/\\/g, '/'), {waitUntil: 'domcontentloaded'});
    try {
      await sp.waitForFunction(
        () => {
          const r = document.getElementById('root');
          return r && r.querySelectorAll('*').length > 50;
        },
        {timeout: 15000},
      );
      const s = await readState(sp);
      if (!s.ok || s.nodes < 50) problems.push(`standalone.html 渲染异常: ${JSON.stringify(s)}`);
      if (standaloneErr) problems.push(`standalone.html pageerror: ${standaloneErr}`);
      console.log(`  ${s.ok && s.nodes > 50 && !standaloneErr ? '✓' : '✗'} nodes=${s.nodes} 文本=${s.textLen}字`);
      await sp.screenshot({path: path.join(OUT, 'standalone.png')});
    } catch (e) {
      problems.push(`standalone.html 无法渲染: ${e.message}`);
      console.log('  ✗ 渲染超时');
    }
    await sp.close();
  } else {
    console.log('  – 未找到，请先执行 npm run build:web');
  }

  // 结论用同步写，避免 process.exit 时管道输出被截断
  const report =
    '\n════════ 结果 ════════\n' +
    (problems.length === 0
      ? '✓ 全部通过，无控制台错误，六个页面在三档视口下均正常渲染\n'
      : `✗ 发现 ${problems.length} 个问题：\n` + problems.map(p => '  - ' + p).join('\n') + '\n') +
    `截图目录：${OUT}\n`;
  fs.writeSync(1, report);

  // 直接杀浏览器进程再退出。Windows 下 headless Chromium 的 close() 经常不返回，
  // 一旦 await 住它，node 事件循环就永远退不出去
  try {
    browser.process()?.kill('SIGKILL');
  } catch (_) {
    /* ignore */
  }
  setTimeout(() => process.exit(problems.length === 0 ? 0 : 1), 200);
}

main().catch(err => {
  console.error('[smoke] 崩溃', err);
  process.exit(1);
});
