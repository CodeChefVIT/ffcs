(() => {
  const encoder = new TextEncoder();
  const table = Array.from({ length: 256 }, (_, value) => {
    for (let i = 0; i < 8; i++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
    return value >>> 0;
  });
  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = (crc >>> 8) ^ table[(crc ^ byte) & 255];
    return (crc ^ 0xffffffff) >>> 0;
  }
  function createZip(files) {
    if (!Array.isArray(files) || !files.length || files.length > 1000)
      throw new Error('Invalid ZIP file list.');
    const chunks = [],
      central = [],
      seen = new Set();
    let offset = 0;
    for (const file of files) {
      if (
        typeof file.name !== 'string' ||
        !file.name ||
        file.name.includes('\\') ||
        file.name.startsWith('/') ||
        file.name.includes(':') ||
        file.name.includes('\0') ||
        file.name.split('/').some(part => !part || part === '.' || part === '..') ||
        seen.has(file.name)
      )
        throw new Error('Invalid or repeated ZIP path.');
      seen.add(file.name);
      const name = encoder.encode(file.name);
      const bytes = typeof file.text === 'string' ? encoder.encode(file.text) : file.bytes;
      if (!(bytes instanceof Uint8Array) || name.length > 65535)
        throw new Error('Invalid ZIP content.');
      if (offset + bytes.length > 100 * 1024 * 1024)
        throw new Error('Export exceeds 100 MB. Export fewer categories.');
      const crc = crc32(bytes);
      const header = new Uint8Array(30),
        h = new DataView(header.buffer);
      h.setUint32(0, 0x04034b50, true);
      h.setUint16(4, 20, true);
      h.setUint16(6, 0x0800, true);
      h.setUint16(12, 33, true);
      h.setUint32(14, crc, true);
      h.setUint32(18, bytes.length, true);
      h.setUint32(22, bytes.length, true);
      h.setUint16(26, name.length, true);
      chunks.push(header, name, bytes);
      const index = new Uint8Array(46),
        d = new DataView(index.buffer);
      d.setUint32(0, 0x02014b50, true);
      d.setUint16(4, 20, true);
      d.setUint16(6, 20, true);
      d.setUint16(8, 0x0800, true);
      d.setUint16(14, 33, true);
      d.setUint32(16, crc, true);
      d.setUint32(20, bytes.length, true);
      d.setUint32(24, bytes.length, true);
      d.setUint16(28, name.length, true);
      d.setUint32(42, offset, true);
      central.push(index, name);
      offset += header.length + name.length + bytes.length;
    }
    const directorySize = central.reduce((sum, chunk) => sum + chunk.length, 0);
    const end = new Uint8Array(22),
      e = new DataView(end.buffer);
    e.setUint32(0, 0x06054b50, true);
    e.setUint16(8, files.length, true);
    e.setUint16(10, files.length, true);
    e.setUint32(12, directorySize, true);
    e.setUint32(16, offset, true);
    const output = new Uint8Array(offset + directorySize + end.length);
    let cursor = 0;
    for (const chunk of [...chunks, ...central, end]) {
      output.set(chunk, cursor);
      cursor += chunk.length;
    }
    return output;
  }
  globalThis.FFCSZip = Object.freeze({ createZip, crc32 });
})();
