const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        results = results.concat(walk(full));
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
      results.push(full);
    }
  }
  return results;
}

const files = walk("./src");
const matches = [];
for (const f of files) {
  const content = fs.readFileSync(f, "utf-8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (/(1688|taobao|tmall)/i.test(line)) {
      matches.push({ file: f, line: idx + 1, text: line.trim() });
    }
  });
}
console.log("Total 1688/Taobao matches in src/:", matches.length);
matches.forEach((m) => console.log(`${m.file}:${m.line} -> ${m.text.substring(0, 110)}`));
