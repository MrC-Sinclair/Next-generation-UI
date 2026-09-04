#!/usr/bin/env python3
"""
把 expo 静态导出产物打包成单个自包含 HTML（preview.html）：
- 字体按页面实际字符子集化 → base64 内联到 @font-face
- global.css / entry JS 全部内联
- 零外部请求：blob/srcdoc/file:// /任意沙箱 iframe 都能渲染

用法： python3 scripts/build-single-file.py   （在跑完 export + make-paths-relative 之后）
"""
import base64
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
FONTS = DIST / "assets" / "assets" / "fonts"
OUT = DIST / "preview.html"

html = (DIST / "index.html").read_text(encoding="utf-8")

# ---------- 1. 收集全部路由页面实际用到的字符（含 ASCII 常用集兜底） ----------
# 注意排除 preview.html 自身（内联了整个 bundle，字符集会爆炸）
pages = [p for p in sorted(DIST.glob("*.html")) if p.name != OUT.name]
page_text = " ".join(p.read_text(encoding="utf-8") for p in pages)
text = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>", " ", page_text)
text = re.sub(r"<[^>]+>", " ", text)
charset = set(text) | set(chr(i) for i in range(0x20, 0x7F)) | set("，。、；：？！“”‘’（）—…·")
charset_file = ROOT / "scripts" / ".preview-charset.txt"
charset_file.write_text("".join(sorted(charset)), encoding="utf-8")
print(f"charset: {len(charset)} chars")

# ---------- 2. 字体子集化 + base64 ----------
MIME = ".ttf:font/ttf"
font_map: dict[str, str] = {}
for ttf in sorted(FONTS.glob("*.ttf")):
    subset = ttf.with_name(ttf.stem + ".preview.ttf")
    subprocess.run(
        [
            "pyftsubset", str(ttf),
            f"--text-file={charset_file}",
            f"--output-file={subset}",
            "--layout-features=*",
        ],
        check=True,
    )
    data = base64.b64encode(subset.read_bytes()).decode()
    # 源文件名（带 hash）→ data URI
    font_map[ttf.name] = f"data:font/ttf;base64,{data}"
    print(f"  {ttf.name} -> {len(data) // 1024}KB base64")
    subset.unlink()

# @font-face 的 url 替换成 data URI（html 里已是相对路径 assets/assets/fonts/xxx.ttf）
for name, uri in font_map.items():
    html = html.replace(f'url("assets/assets/fonts/{name}")', f'url("{uri}")')
    html = html.replace(f"url('assets/assets/fonts/{name}')", f"url('{uri}')")

# ---------- 3. 内联 CSS ----------
css_link = re.search(r'<link[^>]*rel="stylesheet"[^>]*href="(_expo/static/css/[^"]+)"[^>]*/?>', html)
if css_link:
    css = (DIST / css_link.group(1)).read_text(encoding="utf-8")
    html = html.replace(css_link.group(0), f"<style>{css}</style>")
    print(f"css inlined: {len(css) // 1024}KB")

# ---------- 4. 内联 JS ----------
script_tag = re.search(r'<script[^>]*src="(_expo/static/js/web/[^"]+)"[^>]*></script>', html)
if script_tag:
    js = (DIST / script_tag.group(1)).read_text(encoding="utf-8")
    assert "</script" not in js, "bundle contains </script>, needs escaping"
    html = html.replace(script_tag.group(0), f"<script>{js}</script>")
    print(f"js inlined: {len(js) // 1024}KB")

# ---------- 5. favicon 内联（小文件，顺手） ----------
fav = re.search(r'<link[^>]*href="favicon\.ico"[^>]*/?>', html)
if fav:
    ico = base64.b64encode((DIST / "favicon.ico").read_bytes()).decode()
    html = html.replace(fav.group(0), f'<link rel="icon" href="data:image/x-icon;base64,{ico}"/>')

OUT.write_text(html, encoding="utf-8")
print(f"\nwrote {OUT} ({OUT.stat().st_size / 1024 / 1024:.2f} MB)")
