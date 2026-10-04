const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dest = path.join(__dirname, '..', '.agents', 'skills');
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

console.log('Extracting 3d-web-experience-antigravityskills-com.zip to:', dest);
execSync(`tar -xf 3d-web-experience-antigravityskills-com.zip -C "${dest}"`);
console.log('Extraction complete. Files in skill dir:');
const skillDir = path.join(dest, '3d-web-experience');
if (fs.existsSync(skillDir)) {
  console.log(fs.readdirSync(skillDir));
} else {
  console.log('Skill dir not found directly, checking dest:');
  console.log(fs.readdirSync(dest));
}
