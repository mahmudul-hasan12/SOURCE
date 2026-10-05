const ts = require('typescript');
const fs = require('fs');

const files = [
  'src/app/api/products/resolve/route.ts',
  'src/app/page.tsx',
  'src/app/search/page.tsx',
  'src/components/MobileBottomNav.tsx',
  'src/components/Navbar.tsx',
  'src/components/ProductDetailClient.tsx',
  'src/lib/translate.ts'
];

let hasError = false;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const res = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX
    },
    reportDiagnostics: true
  });
  if (res.diagnostics && res.diagnostics.length > 0) {
    console.error(`Error in ${file}:`);
    res.diagnostics.forEach(d => console.error(d.messageText));
    hasError = true;
  } else {
    console.log(`✓ ${file} syntax valid`);
  }
}

if (!hasError) console.log('\nAll modified files transpiled with 0 errors!');
