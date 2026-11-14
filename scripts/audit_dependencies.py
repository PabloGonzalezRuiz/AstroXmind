#!/usr/bin/env python3
"""Summarize npm audit and package-lock licenses without external dependencies."""
import json
import os
from collections import Counter
from pathlib import Path

lock = json.loads(Path("package-lock.json").read_text(encoding="utf-8"))
audit_path = Path("audit-results/npm-audit.json")
try:
    audit = json.loads(audit_path.read_text(encoding="utf-8"))
except (ValueError, OSError) as exc:
    audit = {"error": str(exc)}
packages = lock.get("packages", {})
counts = Counter()
missing = []
unusual = []
for path, pkg in packages.items():
    if not path:
        continue
    license_name = pkg.get("license")
    if not license_name:
        missing.append(path)
    else:
        counts[str(license_name)] += 1
        if str(license_name) not in {"MIT", "ISC", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "0BSD", "CC0-1.0", "Unlicense", "BlueOak-1.0.0", "Python-2.0"}:
            unusual.append((path, str(license_name)))
vulns = audit.get("metadata", {}).get("vulnerabilities", {})
lines = [
    "# AST-003.5 — Dependency and license audit",
    "",
    f"Commit: `{os.environ.get('GITHUB_SHA', 'local')}`",
    f"Packages in lockfile (excluding root): {len(packages) - (1 if '' in packages else 0)}",
    "",
    "## npm audit summary",
]
if "error" in audit or "metadata" not in audit:
    lines.append("Audit result unavailable or invalid; inspect npm-audit.json and logs.")
else:
    lines.extend(f"- {key}: {vulns.get(key, 'unknown')}" for key in ("critical", "high", "moderate", "low", "info", "total"))
lines.extend(["", "## License metadata (not a legal compliance certification)"])
lines.extend(f"- {name}: {count}" for name, count in sorted(counts.items()))
lines.append(f"- Missing license metadata: {len(missing)}")
lines.append(f"- Licenses requiring manual review: {len(unusual)}")
lines.extend(["", "## Missing metadata (first 100)"])
lines.extend(f"- {name}" for name in missing[:100])
lines.extend(["", "## Manual license review (first 100)"])
lines.extend(f"- {name}: {lic}" for name, lic in unusual[:100])
lines.extend(["", "## Interpretation", "npm audit reports known advisories only; missing metadata or unusual licenses require manual inspection before release."])
Path("audit-results/report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("\n".join(lines[:22]))
