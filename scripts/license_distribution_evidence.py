#!/usr/bin/env python3
"""Collect reproducible evidence, not a legal compliance certificate."""
import json
import hashlib
import zlib
import re
import subprocess
import tarfile
import tempfile
from pathlib import Path

ROOT = Path.cwd()
OUT = ROOT / "audit-results"
OUT.mkdir(exist_ok=True)
lock = json.loads((ROOT / "package-lock.json").read_text(encoding="utf-8"))
packages = lock["packages"]
names = [
    "sharp",
    "@img/sharp-libvips-linux-x64",
    "lightningcss",
    "lightningcss-linux-x64-gnu",
]
lines = ["# AST-003.5: exact npm package licenses and dist inventory", "",
         "Generated from package-lock.json, npm tarballs and dist/ in CI.", "",
         "## Exact package evidence", ""]
issues = []
findings = []
for name in names:
    info = packages.get("node_modules/" + name)
    if not info:
        issues.append(f"Package missing from lockfile: {name}")
        continue
    version = info["version"]
    spec = f"{name}@{version}"
    lines += [f"### {spec}", f"- Lockfile license: {info.get('license', '(missing)')}",
              f"- Optional: {bool(info.get('optional'))}"]
    with tempfile.TemporaryDirectory() as td:
        try:
            result = subprocess.run(
                ["npm", "pack", spec, "--ignore-scripts", "--pack-destination", td, "--json"],
                check=True, capture_output=True, text=True, timeout=90)
            meta = json.loads(result.stdout)
            tgz = Path(td) / meta[0]["filename"]
            with tarfile.open(tgz, "r:gz") as archive:
                files = [m for m in archive.getmembers() if m.isfile()]
                notices = [m for m in files if re.search(
                    r"(^|/)(LICENSE|LICENCE|COPYING|NOTICE|THIRD.PARTY.NOTICES)([.\-_]|$)",
                    m.name, re.IGNORECASE)]
                lines.append(f"- Tarball files: {len(files)}")
                lines.append(f"- License/notice files: {len(notices)}")
                for member in notices[:30]:
                    data = archive.extractfile(member).read()
                    digest = hashlib.sha256(data).hexdigest()
                    lines.append(f"  - `{member.name}` ({len(data)} bytes, SHA256 `{digest}`)")
                    safe = re.sub(r"[^A-Za-z0-9_.-]", "_", name + "_" + version + "_" + member.name)
                    (OUT / safe).write_bytes(data[:1_000_000])
                if not notices:
                    findings.append(f"No LICENSE/NOTICE file packaged in {spec}; verify upstream versioned notices and redistribution obligations")
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired, ValueError, OSError, tarfile.TarError) as exc:
            issues.append(f"Failed to inspect {spec}: {str(exc)[:300]}")
            lines.append(f"- Inspection error: {str(exc)[:300]}")
    lines.append("")
lines += ["## Generated dist/ inventory", ""]
dist = ROOT / "dist"
if not dist.is_dir():
    issues.append("dist/ does not exist")
else:
    paths = [p for p in dist.rglob("*") if p.is_file()]
    lines.append(f"- Total files: {len(paths)}")
    extensions = {}
    for p in paths:
        suffix = p.suffix.lower() or "(none)"
        extensions[suffix] = extensions.get(suffix, 0) + 1
    lines += [f"- {ext}: {count}" for ext, count in sorted(extensions.items())]
    lines.append("")
    lines.append("### Files and sizes")
    for p in sorted(paths):
        lines.append(f"- `{p.relative_to(dist)}`: {p.stat().st_size} bytes")
    lines += ["", "### Candidate package references in generated text files"]
    for p in paths:
        if p.suffix.lower() not in {".html", ".js", ".css", ".json", ".txt", ".xml"}:
            continue
        data = p.read_text(encoding="utf-8", errors="replace")
        hits = [word for word in ("sharp", "libvips", "lightningcss") if word in data.lower()]
        if hits:
            lines.append(f"- `{p.relative_to(dist)}`: {', '.join(hits)}")
    lines.append("Absence of text references is not proof of absence of embedded binary/code.")
    lines += ["", "### Distribution evidence: binary and package signature scan"]
    signatures = {
        "ELF": bytes.fromhex("7f454c46"), "Windows PE": b"MZ",
        "WebAssembly": bytes.fromhex("0061736d"), "Mach-O 64": bytes.fromhex("cffaedfe"),
    }
    binary_matches = []
    for p in paths:
        data = p.read_bytes()
        matches = [name for name, magic in signatures.items() if data.startswith(magic)]
        if matches:
            binary_matches.append(f"- `{p.relative_to(dist)}`: {', '.join(matches)}")
    lines += binary_matches or ["- No files with recognized ELF/PE/Wasm/Mach-O headers detected."]
    opaque = [p for p in paths if p.name.startswith("wasm.") and p.suffix.lower() == ".pagefind"]
    lines += ["", "### Opaque Pagefind runtime assets"]
    for p in opaque:
        data = p.read_bytes()
        lines.append(f"- `{p.relative_to(dist)}`: {len(data)} bytes; first 8 bytes `{data[:8].hex()}`; review Pagefind runtime and third-party license separately")
        if data.startswith(bytes.fromhex("1f8b08")):
            try:
                decoder = zlib.decompressobj(wbits=31)
                decoded = decoder.decompress(data, 10_000_001)
                if len(decoded) > 10_000_000 or not decoder.eof:
                    findings.append(f"Pagefind asset {p.relative_to(dist)} could not be fully decompressed within 10 MB limit")
                    lines.append("  - Gzip content exceeds safe inspection limit or is incomplete")
                else:
                    decoded += decoder.flush()
                    lines.append(f"  - Gzip decoded: {len(decoded)} bytes; SHA256 `{hashlib.sha256(decoded).hexdigest()}`; first 8 bytes `{decoded[:8].hex()}`")
                    lines.append(f"  - Decoded WebAssembly magic: {decoded.startswith(bytes.fromhex('0061736d'))}")
            except zlib.error as exc:
                findings.append(f"Pagefind asset {p.relative_to(dist)} gzip decoding failed: {exc}")
                lines.append(f"  - Gzip decoding failed: {exc}")
    if opaque:
        findings.append(f"{len(opaque)} Pagefind wasm.*.pagefind assets present; signature-only scan cannot establish their format or licensing")
    lines += ["", "### Build artifact manifest (SHA256)"]
    manifest = []
    for p in sorted(paths):
        digest = hashlib.sha256(p.read_bytes()).hexdigest()
        manifest.append({"path": str(p.relative_to(dist)), "size": p.stat().st_size, "sha256": digest})
    (OUT / "dist-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    lines.append(f"- Hashed {len(manifest)} output files into `dist-manifest.json`.")
    lines.append("- This is a static signature inventory, not proof of license compliance or a complete embedded-code audit.")
lines += ["", "## License findings (nonfatal)", ""]
lines += [f"- {finding}" for finding in findings] if findings else ["- No missing LICENSE/NOTICE files in inspected tarballs."]
lines += ["", "## Limitations",
          "This report inventories exact package tarballs and static output; it does not determine all legal obligations or guarantee compliance.",
          "The build may use packages not shipped in dist/. Review notices and any distributed binaries manually.",
          "", "## Issues", ""]
lines += [f"- {issue}" for issue in issues] if issues else ["- No collection errors detected."]
(OUT / "license-distribution.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("\n".join(lines[:65]))
if issues:
    raise SystemExit("Evidence collection incomplete: " + "; ".join(issues))
