"""Offline regression tests for AST-003.6 link validator."""
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("check_navigation.py").resolve()

class NavigationTests(unittest.TestCase):
    def check(self, pages):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            for name, content in pages.items():
                target = root / "dist" / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(content, encoding="utf-8")
            result = subprocess.run([sys.executable, str(SCRIPT)], cwd=root,
                                    text=True, capture_output=True)
            report = root / "audit-results/navigation-links.md"
            self.assertTrue(report.is_file(), result.stderr)
            return result.returncode, report.read_text(encoding="utf-8")

    def test_valid_internal_link_and_fragment(self):
        code, report = self.check({
            "index.html": '<a href="/AstroXmind/tema/#seccion">Tema</a>',
            "tema/index.html": '<h2 id="seccion">Sección</h2>',
        })
        self.assertEqual(code, 0, report)

    def test_missing_page_fails(self):
        code, report = self.check({"index.html": '<a href="/AstroXmind/no-existe/">Error</a>'})
        self.assertEqual(code, 1)
        self.assertIn("Missing target", report)

    def test_missing_fragment_fails(self):
        code, report = self.check({"index.html": '<a href="#no-existe">Error</a>'})
        self.assertEqual(code, 1)
        self.assertIn("Missing anchor", report)

    def test_external_link_is_ignored(self):
        code, report = self.check({"index.html": '<a href="https://example.org/other">External</a>'})
        self.assertEqual(code, 0, report)

    def test_assets_exist(self):
        code, report = self.check({"index.html": '<script src="/AstroXmind/_astro/app.js"></script>',
                                   "_astro/app.js": "console.log('ok')"})
        self.assertEqual(code, 0, report)

if __name__ == "__main__":
    unittest.main()
