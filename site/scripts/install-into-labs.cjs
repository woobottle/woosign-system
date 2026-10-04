/** Copy a built showcase into the existing WooBottle static site. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const target = process.argv[2];
if (!target)
  throw new Error(
    'Usage: node site/scripts/install-into-labs.cjs /path/to/woobottle-labs',
  );
const labs = path.resolve(target);
const pkg = JSON.parse(
  fs.readFileSync(path.join(labs, 'package.json'), 'utf8'),
);
if (pkg.name !== 'woobottle-labs')
  throw new Error('Target must be woobottle-labs');
const source = path.join(root, 'site/dist');
const html = fs.readFileSync(path.join(source, 'index.html'), 'utf8');
if (!html.includes('WooSign'))
  throw new Error('Build the showcase with pnpm site:build first');
fs.cpSync(source, path.join(labs, 'public/woosign'), {recursive: true});
console.log('Installed WooSign showcase into public/woosign/');
