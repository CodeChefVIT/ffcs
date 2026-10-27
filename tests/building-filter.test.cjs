const assert = require('node:assert/strict');
const { mkdtempSync, readFileSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');
const ts = require('typescript');

// Compile the real source into a temporary directory; no extra test dependencies.
const outputDir = mkdtempSync(path.join(tmpdir(), 'ffcs-tests-'));
after(() => rmSync(outputDir, { recursive: true, force: true }));
for (const name of ['filterUtils', 'utils', 'slots']) {
  const source = readFileSync(path.join(__dirname, '../src/lib', `${name}.ts`), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  });
  writeFileSync(path.join(outputDir, `${name}.js`), outputText);
}
const { evaluateFilters } = require(path.join(outputDir, 'filterUtils.js'));
const { generateTT } = require(path.join(outputDir, 'utils.js'));

const sameBuilding = venues =>
  evaluateFilters(venues.map(venue => ({ slotName: 'A1', venue }))).sameBuilding;

test('unknown venues and an empty timetable cannot qualify as same-building', () => {
  for (const venue of [undefined, '', '   ', '123']) {
    assert.equal(sameBuilding(['SJT101', venue]), false, `Unknown venue: ${String(venue)}`);
  }
  assert.equal(sameBuilding([undefined, undefined]), false);
  assert.equal(sameBuilding([]), false);
});

test('building prefixes ignore case and surrounding whitespace', () => {
  assert.equal(sameBuilding([' sjt101 ', 'SJT202']), true);
});

test('different building prefixes do not match', () => {
  assert.equal(sameBuilding(['SJT101', 'TT201']), false);
});

test('NIL needs no physical location but does not excuse missing venues or mixed buildings', () => {
  assert.equal(sameBuilding(['SJT101', 'NIL']), true);
  assert.equal(sameBuilding([' nil ', 'SJT101']), true);
  assert.equal(sameBuilding(['NIL', 'NIL']), true);
  assert.equal(sameBuilding(['NIL']), true);
  assert.equal(sameBuilding(['SJT101', 'NIL', 'TT201']), false);
  for (const venue of [undefined, '', '   ', '123']) {
    assert.equal(sameBuilding(['NIL', venue]), false);
    assert.equal(sameBuilding(['SJT101', 'NIL', venue]), false);
  }
});

function generateCombined(theoryVenue, labVenues) {
  return generateTT([
    {
      id: 'test-course',
      courseType: 'both',
      courseCode: 'TEST1001L',
      courseName: 'Theory',
      courseCodeLab: 'TEST1001P',
      courseNameLab: 'Lab',
      courseSlots: [
        {
          slotName: 'A1',
          slotFaculties: [
            {
              facultyName: 'Test faculty',
              facultyLabSlot: 'L31+L32, L37+L38',
              venue: theoryVenue,
              labVenues,
            },
          ],
        },
      ],
    },
  ]).result;
}

test('each lab option uses its own venue independently of the theory venue', () => {
  const labVenues = { 'L31+L32': 'TT201', 'L37+L38': 'SJT202' };
  const result = generateCombined('SJT101', labVenues);
  assert.equal(result.length, 2);
  assert.deepEqual(
    result.map(classes => classes.map(item => [item.slotName, item.venue])),
    [
      [
        ['A1', 'SJT101'],
        ['L31+L32', 'TT201'],
      ],
      [
        ['A1', 'SJT101'],
        ['L37+L38', 'SJT202'],
      ],
    ]
  );
  assert.deepEqual(
    result.map(classes => evaluateFilters(classes).sameBuilding),
    [false, true]
  );
});

test('missing theory or lab venues remain unknown instead of borrowing the other venue', () => {
  for (const [theoryVenue, labVenues] of [
    ['SJT101', undefined],
    [undefined, { 'L31+L32': 'SJT101', 'L37+L38': 'SJT202' }],
  ]) {
    const result = generateCombined(theoryVenue, labVenues);
    assert.equal(result.length, 2);
    for (const classes of result) {
      const [theory, lab] = classes;
      assert.equal(theory.venue, theoryVenue);
      assert.equal(lab.venue, labVenues?.[lab.slotName]);
      assert.equal(evaluateFilters(classes).sameBuilding, false);
    }
  }
});
