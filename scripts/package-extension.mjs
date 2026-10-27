import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'manifest.json',
  'background.js',
  'parser.js',
  'vtop.js',
  'app-bridge.js',
  'popup.html',
  'popup.css',
  'popup.js',
  'README.md',
];
const table = Array.from({ length: 256 }, (_, value) => {
  for (let i = 0; i < 8; i++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  return value >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = (crc >>> 8) ^ table[(crc ^ byte) & 255];
  return (crc ^ 0xffffffff) >>> 0;
}
const chunks = [],
  central = [];
let offset = 0;
for (const file of files) {
  const name = Buffer.from(file);
  const raw = fs.readFileSync(path.join(root, 'extension', file));
  const compressed = zlib.deflateRawSync(raw);
  const crc = crc32(raw);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(8, 8);
  header.writeUInt16LE(33, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(compressed.length, 18);
  header.writeUInt32LE(raw.length, 22);
  header.writeUInt16LE(name.length, 26);
  chunks.push(header, name, compressed);
  const index = Buffer.alloc(46);
  index.writeUInt32LE(0x02014b50, 0);
  index.writeUInt16LE(20, 4);
  index.writeUInt16LE(20, 6);
  index.writeUInt16LE(8, 10);
  index.writeUInt16LE(33, 14);
  index.writeUInt32LE(crc, 16);
  index.writeUInt32LE(compressed.length, 20);
  index.writeUInt32LE(raw.length, 24);
  index.writeUInt16LE(name.length, 28);
  index.writeUInt32LE(offset, 42);
  central.push(index, name);
  offset += header.length + name.length + compressed.length;
}
const directory = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(directory.length, 12);
end.writeUInt32LE(offset, 16);
const output = path.join(root, 'public', 'extensions', 'ffcs-vtop.zip');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, Buffer.concat([...chunks, directory, end]));
console.log(`Packaged ${files.length} extension files: public/extensions/ffcs-vtop.zip`);
