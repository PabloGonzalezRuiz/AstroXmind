#!/usr/bin/env python3
"""Validate local links in the Astro static build, respecting its configured base."""
import html.parser
import json
import posixpath
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

DIST = Path("dist").resolve()
BASE = "/AstroXmind"
HOST = "pablogonzalezruiz.github.io"
REPORT = Path("audit-results/navigation-links.md")
class Links(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        for attr in (("href",) if tag in ("a", "link") else ("src",) if tag in ("img", "script", "iframe", "source") else ()):
            if a.get(attr):
                self.links.append((tag, attr, a[attr]))

def target_file(path):
    p = path.lstrip("/")
    if not p or p.endswith("/"):
        p += "index.html"
    candidate = (DIST / p).resolve()
    if DIST not in candidate.parents:
        return None
    if candidate.is_file():
        return candidate
    if not candidate.suffix:
        fallback = (DIST / p / "index.html").resolve()
        if fallback.is_file() and DIST in fallback.parents:
            return fallback
    return candidate

def main():
    pages = sorted(DIST.rglob("*.html"))
    failures = []
    checked = 0
    parsers = {}
    for page in pages:
        parser = Links()
        parser.feed(page.read_text(encoding="utf-8"))
        parsers[page] = parser
    for page, parser in parsers.items():
        relative_page = "/" + page.relative_to(DIST).as_posix()
        source_url = BASE + relative_page
        for tag, attr, raw in parser.links:
            url = urlsplit(raw.strip())
            if url.scheme in ("mailto", "tel", "data", "javascript") or raw.startswith("//"):
                continue
            if url.scheme and url.scheme not in ("http", "https"):
                continue
            if url.netloc and url.hostname != HOST:
                continue
            if url.netloc and not url.path.startswith(BASE):
                continue
            if not url.path and not url.fragment:
                continue
            if url.path.startswith("/"):
                absolute = url.path
            else:
                absolute = posixpath.normpath(posixpath.join(posixpath.dirname(source_url), url.path)) if url.path else source_url
            if absolute == BASE:
                absolute += "/"
            if not absolute.startswith(BASE + "/"):
                failures.append((str(page.relative_to(DIST)), raw, "URL outside configured base"))
                continue
            decoded = unquote(absolute[len(BASE):])
            destination = target_file(decoded)
            checked += 1
            if destination is None or not destination.is_file():
                failures.append((str(page.relative_to(DIST)), raw, "Missing target"))
            elif url.fragment and destination.suffix == ".html":
                anchor = unquote(url.fragment)
                if anchor not in parsers.get(destination, Links()).ids:
                    failures.append((str(page.relative_to(DIST)), raw, "Missing anchor"))
    REPORT.parent.mkdir(exist_ok=True)
    rows = ["# AST-003.6 — Static navigation check", "",
            f"- HTML pages: {len(pages)}", f"- Local references checked: {checked}",
            f"- Failures: {len(failures)}", "",
            "External sites are not crawled; JavaScript-generated links are not covered.", ""]
    if failures:
        rows += ["## Failures", ""] + [f"- `{src}` -> `{url}`: {reason}" for src, url, reason in failures]
    else:
        rows.append("No broken local links or anchors found.")
    REPORT.write_text("\n".join(rows) + "\n", encoding="utf-8")
    print("\n".join(rows))
    return 1 if failures or not pages else 0
if __name__ == "__main__":
    sys.exit(main())
