(() => {
  function quote(value) {
    return (
      "'" +
      value
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029') +
      "'"
    );
  }
  function object(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
  function validateGroup(group) {
    if (!object(group) || Object.keys(group).length > 5000)
      throw new Error('Invalid captured course group.');
    const result = Object.create(null);
    for (const [subject, entries] of Object.entries(group)) {
      if (
        subject.length > 500 ||
        !/^[A-Z]{2,8}\d{3,5}[A-Z]? - .+$/i.test(subject) ||
        !Array.isArray(entries) ||
        !entries.length ||
        entries.length > 3000
      )
        throw new Error('Invalid captured course.');
      result[subject] = entries.map(entry => {
        if (
          !object(entry) ||
          typeof entry.slot !== 'string' ||
          !/^(?:NIL|(?:L\d{1,2}|[A-K][12]|T[A-K]{1,2}[12]|V\d{1,2})(?:\+(?:L\d{1,2}|[A-K][12]|T[A-K]{1,2}[12]|V\d{1,2}))*)$/.test(
            entry.slot
          ) ||
          typeof entry.venue !== 'string' ||
          entry.venue.length > 200 ||
          typeof entry.faculty !== 'string' ||
          !entry.faculty ||
          entry.faculty.length > 200
        )
          throw new Error('Invalid captured faculty/slot row.');
        return { slot: entry.slot, venue: entry.venue, faculty: entry.faculty };
      });
    }
    return result;
  }
  function serializeGroup(symbol, raw) {
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(symbol)) throw new Error('Invalid export name.');
    const group = validateGroup(raw);
    const lines = [`export const ${symbol} = {`];
    for (const [subject, entries] of Object.entries(group)) {
      lines.push(`  ${quote(subject)}: [`);
      for (const entry of entries)
        lines.push(
          `    { slot: ${quote(entry.slot)}, venue: ${quote(entry.venue)}, faculty: ${quote(entry.faculty)} },`
        );
      lines.push('  ],');
    }
    lines.push('};', '');
    return lines.join('\n');
  }

  function segment(value, label) {
    if (
      typeof value !== 'string' ||
      !value.trim() ||
      value.length > 80 ||
      /[\\/<>:"|?*\x00-\x1f]/.test(value)
    )
      throw new Error(`Enter a valid ${label}.`);
    const result = value.trim().toUpperCase().replace(/[ -]+/g, '_');
    if (!/^[A-Z0-9_]+$/.test(result) || /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/.test(result))
      throw new Error(`Use letters, numbers, spaces or underscores for ${label}.`);
    return result;
  }
  function destinationPath(destination) {
    return `src/data/${segment(destination?.school, 'school')}/${segment(destination?.branch, 'branch')}`;
  }
  function categoryFile(category) {
    const code = category?.code;
    if (
      typeof code !== 'string' ||
      !/^[A-Z][A-Z0-9_]{0,63}$/.test(code) ||
      code.toLowerCase() === 'index'
    )
      throw new Error('VTOP returned an unsupported category code.');
    return code + '.ts';
  }
  function buildFiles(destination, categories, groups) {
    const folder = destinationPath(destination);
    if (
      !Array.isArray(categories) ||
      !categories.length ||
      categories.length > 100 ||
      !object(groups)
    )
      throw new Error('Connect to VTOP to load its course categories.');
    const seen = new Set(),
      files = [],
      imports = [],
      entries = [];
    for (const category of categories) {
      const file = categoryFile(category);
      if (seen.has(file.toLowerCase())) throw new Error('VTOP returned repeated category codes.');
      seen.add(file.toLowerCase());
      if (!Object.prototype.hasOwnProperty.call(groups, category.code))
        throw new Error(`Missing captured category: ${category.code}`);
      files.push({
        name: `${folder}/${file}`,
        text: serializeGroup(category.code, groups[category.code]),
      });
      imports.push(`import { ${category.code} } from './${category.code}';`);
      entries.push(`  ${quote(category.code)}: ${category.code},`);
    }
    const symbol = `${segment(destination.school, 'school')}_${segment(destination.branch, 'branch')}`;
    files.push({
      name: `${folder}/index.ts`,
      text: [...imports, '', `export const ${symbol} = {`, ...entries, '};', ''].join('\n'),
    });
    return files;
  }
  globalThis.FFCSContributorExport = Object.freeze({
    buildFiles,
    serializeGroup,
    validateGroup,
    destinationPath,
    categoryFile,
  });
})();
