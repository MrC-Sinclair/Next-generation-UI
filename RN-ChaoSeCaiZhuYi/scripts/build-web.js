/**
 * Web 生产构建（esbuild，秒级打包）
 * 输出：web-dist/app.js / index.html / standalone.html
 */
const fs = require('fs');
const path = require('path');

async function main() {
  const esbuild = require('esbuild');
  const ROOT = path.resolve(__dirname, '..');
  const OUT = path.join(ROOT, 'web-dist');

  fs.mkdirSync(OUT, {recursive: true});

  // 清掉上一次的生产产物。只删这四个，
  // 不动 dev 服务器正在用的 app.dev.js —— 否则 dev 跑着的时候构建会把它打断
  for (const f of ['app.js', 'app.js.map', 'index.html', 'standalone.html']) {
    fs.rmSync(path.join(OUT, f), {force: true});
  }

  await esbuild.build({
    entryPoints: [path.join(ROOT, 'web', 'index.web.js')],
    bundle: true,
    outfile: path.join(OUT, 'app.js'),
    format: 'iife',
    platform: 'browser',
    target: 'es2019',
    jsx: 'automatic',
    alias: {'react-native': 'react-native-web'},
    define: {
      __DEV__: 'false',
      // 同 dev-web.js：浏览器里补上 global，避免 Animated 卸载时报错
      global: 'globalThis',
    },
    banner: {js: 'window.process={env:{NODE_ENV:"production"}};'},
    minify: true,
    logLevel: 'warning',
  });

  // 把 JS 内联进 <script> 前必须转义三类 HTML 敏感序列：
  //   </script  → 会提前闭合脚本标签
  //   <script   → 在 escaped 状态下会进入双转义态
  //   <!--      → 会让解析器进入 escaped 态
  const js = fs.readFileSync(path.join(OUT, 'app.js'), 'utf8');
  const html = fs.readFileSync(path.join(ROOT, 'web', 'index.html'), 'utf8');

  const safeJs = js
    .replace(/<\/(script)/gi, '<\\/$1')
    .replace(/<(script)/gi, '<\\$1')
    .replace(/<!--/g, '<\\!--');

  const withScript = html.replace('</body>', '  <script src="app.js"></script>\n  </body>');
  fs.writeFileSync(path.join(OUT, 'index.html'), withScript);

  // 注意：必须用函数形式替换。压缩后的代码里含有 $& / $$ 等序列，
  // 用字符串形式会被 String.replace 当成替换模式，直接把产物打坏。
  const standalone = withScript.replace('  <script src="app.js"></script>', () => '  <script>\n' + safeJs + '\n  </script>');
  fs.writeFileSync(path.join(OUT, 'standalone.html'), standalone);

  console.log('[build:web] app.js       ' + (js.length / 1024).toFixed(0) + ' KB');
  console.log('[build:web] standalone.html ' + (standalone.length / 1024).toFixed(0) + ' KB');
}

main().catch(err => {
  console.error('[build:web] 失败', err);
  process.exit(1);
});
