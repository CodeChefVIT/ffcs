(() => {
  const clean = value =>
    String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim();
  const slotPattern =
    /^(?:NIL|(?:L\d{1,2}|[A-K][12]|T[A-K]{1,2}[12]|V\d{1,2})(?:\+(?:L\d{1,2}|[A-K][12]|T[A-K]{1,2}[12]|V\d{1,2}))*)$/;
  function courses(doc) {
    const result = new Map();
    for (const option of doc.querySelectorAll('option')) {
      const code = clean(option.value).toUpperCase();
      if (option.disabled || !/^[A-Z]{2,8}\d{3,5}[A-Z]?$/i.test(code)) continue;
      const title = clean(option.textContent).replace(
        new RegExp(`^${code}\\s*(?:[-–—:]\\s*)?`, 'i'),
        ''
      );
      if (title) result.set(code, { code, name: `${code} - ${title}` });
    }
    return [...result.values()];
  }
  function sections(doc) {
    const entries = [];
    const seen = new Set();
    for (const table of doc.querySelectorAll('table')) {
      let columns = null;
      for (const row of table.querySelectorAll('tr')) {
        const cells = [...row.children].filter(cell => /^(TD|TH)$/.test(cell.tagName));
        const labels = cells.map(cell => clean(cell.textContent));
        const slotIndex = labels.findIndex(label => /^slot(?:\s|$)/i.test(label));
        const facultyIndex = labels.findIndex(label => /faculty/i.test(label));
        const venueIndex = labels.findIndex(label => /venue|room/i.test(label));
        if (slotIndex >= 0 && facultyIndex >= 0 && venueIndex >= 0) {
          columns = { slot: slotIndex, faculty: facultyIndex, venue: venueIndex };
          continue;
        }
        const indexes = columns || (cells.length === 4 ? { slot: 0, venue: 1, faculty: 2 } : null);
        if (!indexes) continue;
        const slot = clean(labels[indexes.slot]).toUpperCase().replace(/\s+/g, '');
        const faculty = clean(labels[indexes.faculty]);
        const venue = clean(labels[indexes.venue]);
        if (!slotPattern.test(slot) || !faculty) continue;
        const key = JSON.stringify([slot, faculty, venue]);
        if (!seen.has(key)) {
          seen.add(key);
          entries.push({ slot, faculty, venue });
        }
      }
    }
    return entries;
  }
  function validDataset(value) {
    if (
      !value ||
      value.schemaVersion !== 1 ||
      value.source !== 'vtop' ||
      !/^[a-f0-9]{64}$/.test(value.catalogueId) ||
      typeof value.capturedAt !== 'string' ||
      !Number.isFinite(Date.parse(value.capturedAt)) ||
      typeof value.term !== 'string' ||
      value.term.length > 200 ||
      !value.categories ||
      Array.isArray(value.categories) ||
      typeof value.categories !== 'object'
    )
      return false;
    let count = 0;
    const categories = Object.entries(value.categories);
    if (!categories.length || categories.length > 100) return false;
    for (const [category, subjects] of categories) {
      if (
        !category ||
        category.length > 200 ||
        !subjects ||
        typeof subjects !== 'object' ||
        Array.isArray(subjects)
      )
        return false;
      for (const [subject, entries] of Object.entries(subjects)) {
        if (
          ++count > 5000 ||
          subject.length > 500 ||
          !/^[A-Z]{2,8}\d{3,5}[A-Z]? - .+$/i.test(subject) ||
          !Array.isArray(entries) ||
          !entries.length ||
          entries.length > 3000
        )
          return false;
        for (const entry of entries) {
          if (
            !entry ||
            typeof entry.slot !== 'string' ||
            !slotPattern.test(entry.slot) ||
            typeof entry.faculty !== 'string' ||
            !entry.faculty ||
            entry.faculty.length > 200 ||
            typeof entry.venue !== 'string' ||
            entry.venue.length > 200
          )
            return false;
        }
      }
    }
    return count > 0;
  }
  globalThis.FFCSVtopParser = Object.freeze({ clean, courses, sections, validDataset });
})();
