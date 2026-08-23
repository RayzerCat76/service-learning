const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function checkJs(name, code) {
  try {
    new vm.Script(code, { filename: name });
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

function checkInlineScripts(file) {
  const html = read(file);
  const regex = /<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(html))) {
    count += 1;
    checkJs(`${file}#inline-script-${count}`, match[1]);
  }
  if (!count) throw new Error(`No inline scripts found in ${file}`);
}

checkJs('renderer.js', read('renderer.js'));
checkJs('api/programs.js', read('api/programs.js'));
checkJs('api/_auth.js', read('api/_auth.js'));
checkJs('api/auth/login.js', read('api/auth/login.js'));
checkJs('api/auth/logout.js', read('api/auth/logout.js'));
checkInlineScripts('admin.html');
checkInlineScripts('index.html');
JSON.parse(read('vercel.json'));
JSON.parse(read('package.json'));
console.log('✓ configuration JSON');
console.log('Service Learning syntax validation passed.');
