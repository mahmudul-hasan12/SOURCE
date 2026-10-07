const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = 'C:\\Users\\TAWHID TOPON\\Documents\\google';
const destDir = 'C:\\Users\\TAWHID TOPON\\Documents\\google\\SOURCE';
const gitPath = 'C:\\Users\\TAWHID TOPON\\AppData\\Local\\GitHubDesktop\\app-3.6.6\\resources\\app\\git\\cmd\\git.exe';

const exclude = new Set(['node_modules', '.next', '.git', 'SOURCE']);

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying project files to SOURCE repository folder...');
const items = fs.readdirSync(srcDir);
for (const item of items) {
  if (exclude.has(item)) continue;
  const s = path.join(srcDir, item);
  const d = path.join(destDir, item);
  copyRecursiveSync(s, d);
}
console.log('Files copied successfully!');

console.log('Running git commands in SOURCE...');
try {
  execSync(`"${gitPath}" config user.name "mahmudul-hasan12"`, { cwd: destDir, stdio: 'inherit' });
  execSync(`"${gitPath}" config user.email "riode520@gmail.com"`, { cwd: destDir, stdio: 'inherit' });
  execSync(`"${gitPath}" add .`, { cwd: destDir, stdio: 'inherit' });
  try {
    execSync(`"${gitPath}" commit -m "Clean catalog, white-label UI, verified extension importer and error-free build"`, { cwd: destDir, stdio: 'inherit' });
  } catch (e) {
    console.log('Commit note: already up to date or nothing new to commit.');
  }
  execSync(`"${gitPath}" status`, { cwd: destDir, stdio: 'inherit' });
  console.log('\n>>> READY FOR GITHUB DESKTOP PUSH! <<<');
} catch (err) {
  console.error('Git error:', err);
}
