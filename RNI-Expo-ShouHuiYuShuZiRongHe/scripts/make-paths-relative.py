#!/usr/bin/env python3
"""
把 expo static 导出产物里的根绝对路径改写为相对路径，
使 dist 在任意子路径（预览沙箱 / GitHub Pages 子目录 / 根域名）都可打开。

用法： python3 scripts/make-paths-relative.py [dist目录，默认 ./dist]
每次 `npx expo export` 之后运行一次。
"""
import re
import sys
from pathlib import Path

dist = Path(sys.argv[1] if len(sys.argv) > 1 else "dist")

HTML_FIXES = [
    ('href="/_expo/', 'href="_expo/'),
    ('src="/_expo/', 'src="_expo/'),
    ('href="/assets/', 'href="assets/'),
    ('src="/assets/', 'src="assets/'),
    ('href="/favicon', 'href="favicon'),
    ('url("/assets/', 'url("assets/'),
    ("url('/assets/", "url('assets/"),
    ('url(/assets/', 'url(assets/'),
]
JS_FIXES = [
    ('"/assets/', '"assets/'),
]
CSS_FIXES = [
    ("url('/assets/", "url('assets/"),
    ('url("/assets/', 'url("assets/'),
    ('url(/assets/', 'url(assets/'),
]


def apply(path: Path, fixes) -> int:
    text = path.read_text(encoding="utf-8")
    n = 0
    for old, new in fixes:
        n += text.count(old)
        text = text.replace(old, new)
    if n:
        path.write_text(text, encoding="utf-8")
    return n


total = 0
for html in dist.glob("*.html"):
    total += apply(html, HTML_FIXES)
for js in (dist / "_expo").rglob("*.js"):
    total += apply(js, JS_FIXES)
for css in (dist / "_expo").rglob("*.css"):
    total += apply(css, CSS_FIXES)

print(f"done: rewrote {total} absolute asset refs in {dist}")
