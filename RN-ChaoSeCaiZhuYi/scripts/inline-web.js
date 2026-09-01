/**
 * 把 webpack 产出的 index.html + bundle.js 合并成一个自包含的 standalone.html。
 * 用途：双击即可打开预览（file:// 协议下也能跑），也方便直接嵌入小程序 WebView。
 */
const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'web-dist');
const htmlPath = path.join(dist, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('[inline-web] 找不到 web-dist/index.html，请先执行 npm run build:web');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const match = html.match(/<script[^>]*src="([^"]+)"[^>]*>\s*<\/script>/i);

if (!match) {
  console.error('[inline-web] index.html 里没有找到 bundle script');
  process.exit(1);
}

const jsPath = path.join(dist, match[1].replace(/^\.?\//, ''));
const js = fs.readFileSync(jsPath, 'utf8');
const safeJs = js.replace(/<\/script>/gi, '<\\/script>');

const out = html.replace(match[0], `<script>${safeJs}</script>`);
const outPath = path.join(dist, 'standalone.html');
fs.writeFileSync(outPath, out, 'utf8');

const kb = (Buffer.byteLength(out, 'utf8') / 1024).toFixed(0);
console.log(`[inline-web] 已生成 web-dist/standalone.html（${kb} KB，可直接双击打开）`);
