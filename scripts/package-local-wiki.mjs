import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, renameSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
for (const file of ['index.html', 'navigation.json', 'references.json', 'navegacion/index.html']) {
  if (!existsSync(join(dist, file))) throw new Error(`Falta dist/${file}. Compila la wiki antes de empaquetar.`);
}

const destination = join(root, 'packages');
mkdirSync(destination, { recursive: true });
const staging = mkdtempSync(join(destination, '.wiki-'));
const contents = mkdtempSync(join(tmpdir(), 'astroxmind-wiki-'));
try {
  cpSync(join(root, 'scripts/local-wiki'), contents, { recursive: true });
  cpSync(dist, join(contents, 'AstroXmind'), { recursive: true });
  const archive = join(staging, 'AstroXmind-Wiki-Local.zip');
  if (process.platform === 'win32') {
    execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      'Compress-Archive -Path (Join-Path $env:ASTROXMIND_PACKAGE_INPUT "*") -DestinationPath $env:ASTROXMIND_PACKAGE_OUTPUT -ErrorAction Stop',
    ], { stdio: 'inherit', env: { ...process.env, ASTROXMIND_PACKAGE_INPUT: contents, ASTROXMIND_PACKAGE_OUTPUT: archive } });
  } else {
    execFileSync('zip', ['-q', '-r', archive, '.'], { cwd: contents, stdio: 'inherit' });
  }
  const output = join(destination, 'AstroXmind-Wiki-Local.zip');
  renameSync(archive, output);
  console.log(output);
} finally {
  rmSync(staging, { recursive: true, force: true });
  rmSync(contents, { recursive: true, force: true });
}
