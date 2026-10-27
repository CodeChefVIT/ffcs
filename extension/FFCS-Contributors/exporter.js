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
  function buildFiles(profile, mappings, groups, includeIndex = true) {
    if (
      !profile ||
      !/^[A-Za-z0-9_]+$/.test(profile.folder) ||
      !Array.isArray(profile.files) ||
      !Array.isArray(mappings) ||
      !mappings.length ||
      !object(groups)
    )
      throw new Error('Select a repository folder and at least one category.');
    const used = new Set(),
      codes = new Set(),
      files = [];
    for (const mapping of mappings) {
      const target = profile.files.find(file => file.file === mapping.file);
      if (
        !target ||
        !/^[A-Za-z0-9_]+\.ts$/.test(target.file) ||
        target.file === 'index.ts' ||
        used.has(target.file) ||
        codes.has(mapping.code)
      )
        throw new Error('Each category must map to a different existing data file.');
      if (!Object.prototype.hasOwnProperty.call(groups, mapping.code))
        throw new Error(`Missing captured category: ${mapping.code}`);
      used.add(target.file);
      codes.add(mapping.code);
      files.push({
        name: `src/data/${profile.folder}/${target.file}`,
        text: serializeGroup(target.symbol, groups[mapping.code]),
      });
    }
    if (includeIndex) {
      if (typeof profile.indexSource !== 'string') throw new Error('Missing repository index.');
      files.push({ name: `src/data/${profile.folder}/index.ts`, text: profile.indexSource });
    }
    return files;
  }
  const aliases = {
    FC: ['foundationcore'],
    DC: ['disciplinecore'],
    DE: ['disciplineelective'],
    DLES: ['disciplinelinkedengineeringsciences'],
    DL: ['disciplinelinkedengineeringsciences'],
    OE: ['openelective', 'openelectivecourses'],
    OEC: ['openelective', 'openelectivecourses'],
    UCC: ['universitycorecourses', 'universitycoremic'],
    UC: ['universitycoremic'],
    PCC: ['professionalcorecourses'],
    PC: ['programmecoremic'],
    PE: ['programmeelectivemic'],
    UE: ['universityelectivemic'],
    FCON: ['concentrationcourses'],
    CON: ['concentrationcourses'],
    PFCC: ['programmefoundationcoremic'],
    PFEC: ['programmefreeelectivemic'],
    ME: ['multidisciplinaryelective'],
    NGCR: ['ngcr'],
  };
  const normalize = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  function suggestFile(profile, category) {
    const code = category.code.toUpperCase();
    let options = profile.files.filter(
      file => normalize(file.file.replace(/\.ts$/, '')) === normalize(code)
    );
    if (options.length === 1) return options[0].file;
    const keys = aliases[code] || [];
    options = profile.files.filter(file => keys.includes(normalize(file.category)));
    if (options.length === 1) return options[0].file;
    options = profile.files.filter(file => normalize(file.category) === normalize(category.label));
    return options.length === 1 ? options[0].file : '';
  }
  globalThis.FFCSContributorExport = Object.freeze({
    buildFiles,
    serializeGroup,
    validateGroup,
    suggestFile,
  });
})();
