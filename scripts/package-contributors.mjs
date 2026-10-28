import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'extension', 'FFCS-Contributors');
const schools = [
  ...new Set(
    fs
      .readdirSync(path.join(root, 'src', 'data'), { withFileTypes: true })
      .filter(item => item.isDirectory())
      .map(item => item.name.replace(/^MTech_/, '').replace(/_F$/, ''))
  ),
].sort();
fs.writeFileSync(
  path.join(source, 'catalogue.json'),
  JSON.stringify({ schemaVersion: 2, schools }, null, 2) + '\n'
);
fs.copyFileSync(
  path.join(root, 'extension', 'Client', 'parser.js'),
  path.join(source, 'parser.js')
);
const files = [
  'manifest.json',
  'background.js',
  'vtop.js',
  'parser.js',
  'exporter.js',
  'zip.js',
  'catalogue.json',
  'contributor.html',
  'contributor.css',
  'contributor.js',
  'README.md',
];
const sandbox = vm.createContext({ TextEncoder, Uint8Array, DataView });
vm.runInContext(fs.readFileSync(path.join(source, 'zip.js'), 'utf8'), sandbox);
const archive = sandbox.FFCSZip.createZip(
  files.map(name => ({ name, bytes: new Uint8Array(fs.readFileSync(path.join(source, name))) }))
);
const output = path.join(root, 'public', 'extensions', 'FFCS-Contributors.zip');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, archive);
console.log(
  `Packaged standalone contributor extension (${schools.length} schools, ${files.length} extension files).`
);
console.log('public/extensions/FFCS-Contributors.zip');
