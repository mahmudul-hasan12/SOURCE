const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  // Use tar or powershell to view or extract
  const res = execSync('tar -tf 3d-web-experience-antigravityskills-com.zip', { encoding: 'utf8' });
  console.log('Zip contents:\n', res);
} catch (err) {
  console.error('Error listing with tar:', err.message);
}
