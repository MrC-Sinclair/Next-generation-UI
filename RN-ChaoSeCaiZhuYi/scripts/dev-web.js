/**
 * Web 开发服务器（esbuild serve，支持热更新）
 * 默认端口 4321：http://localhost:4321
 */
const fs = require('fs');
const path = require('path');

async function main() {
  const esbuild = require('esbuild');
  const ROOT = path.resolve(__dirname, '..');
  // 开发产物单独放 web-dev/。不能复用 web-dist/ —— 那是 build:web 的部署产物目录，
  // 两边共用会出现「开一次 dev 就把部署包换成未压缩版本」这种静默事故
  const OUT = path.join(ROOT, 'web-dev');

  fs.mkdirSync(OUT, {recursive: true});

  const ctx = await esbuild.context({
    entryPoints: [path.join(ROOT, 'web', 'index.web.js')],
    bundle: true,
    // 刻意不叫 app.js：生产构建（build:web）的输出也叫 app.js，
    // 同名会互相覆盖 —— 开一次 dev 就把部署产物变成未压缩的 dev 包
    outfile: path.join(OUT, 'app.dev.js'),
    format: 'iife',
    platform: 'browser',
    target: 'es2019',
    jsx: 'automatic',
    alias: {'react-native': 'react-native-web'},
    define: {
      __DEV__: 'true',
      // RN 的 Animated / Timer 等模块会直接引用 Node 风格的 global，
      // 浏览器里没有，必须垫成 globalThis，否则组件卸载时会抛 "global is not defined"
      global: 'globalThis',
    },
    banner: {js: 'window.process={env:{NODE_ENV:"development"}};'},
    sourcemap: true,
    logLevel: 'info',
  });

  await ctx.watch();

  // 先写一份 dev 用的 index.html
  const html = fs
    .readFileSync(path.join(ROOT, 'web', 'index.html'), 'utf8')
    .replace('</body>', '  <script src="app.dev.js"></script>\n  </body>');
  fs.writeFileSync(path.join(OUT, 'index.html'), html);

  const {host, port} = await ctx.serve({servedir: OUT, port: 4321, fallback: '/index.html'});
  // esbuild 监听 0.0.0.0 时 host 可能是 undefined，这里兜一下
  const url = `http://${host || 'localhost'}:${port}`;
  console.log(`\n  CHROMA 开发服务器: ${url}\n  编辑 src/ 后页面会自动刷新\n`);
}

main().catch(err => {
  console.error('[dev:web] 失败', err);
  process.exit(1);
});
