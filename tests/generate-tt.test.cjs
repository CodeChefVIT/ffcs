const assert = require('node:assert/strict');
const { mkdtempSync, readFileSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');
const ts = require('typescript');

const outputDir = mkdtempSync(path.join(tmpdir(), 'ffcs-gen-tests-'));
after(() => rmSync(outputDir, { recursive: true, force: true }));

for (const name of ['filterUtils', 'utils', 'slots']) {
  const source = readFileSync(path.join(__dirname, '../src/lib', `${name}.ts`), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  });
  writeFileSync(path.join(outputDir, `${name}.js`), outputText);
}

const { generateTT } = require(path.join(outputDir, 'utils.js'));

test('multiple conflicting faculty options in All Subjects Mode OFF does not create duplicate partial timetables', () => {
  const courseData = [
    {
      id: 'course-1',
      courseType: 'th',
      courseCode: 'CSE1001',
      courseName: 'Problem Solving',
      courseSlots: [
        {
          slotName: 'A1',
          slotFaculties: [{ facultyName: 'Prof 1', venue: 'SJT101' }],
        },
      ],
    },
    {
      id: 'course-2',
      courseType: 'th',
      courseCode: 'CSE1002',
      courseName: 'Data Structures',
      courseSlots: [
        {
          slotName: 'A1',
          slotFaculties: [
            { facultyName: 'Faculty Conflicting 1', venue: 'SJT201' },
            { facultyName: 'Faculty Conflicting 2', venue: 'SJT202' },
            { facultyName: 'Faculty Conflicting 3', venue: 'SJT203' },
            { facultyName: 'Faculty Conflicting 4', venue: 'SJT204' },
          ],
        },
      ],
    },
  ];

  const offResult = generateTT(courseData, false);

  // In the buggy version, course-1 was pushed 4 times because course-2 had 4 conflicting faculty.
  // In the fixed version, skipping course-2 is treated as one choice, giving exactly 1 partial timetable.
  assert.equal(offResult.result.length, 1);
  assert.equal(offResult.result[0].length, 1);
  assert.equal(offResult.result[0][0].courseCode, 'CSE1001');

  // Verify skipped courses tracking
  assert.ok(offResult.skippedCourses.includes('CSE1002'));
  assert.equal(offResult.skippedCourses.includes('CSE1001'), false);
});

test('multiple conflicting faculty options in All Subjects Mode ON yields 0 timetables and reports clash message', () => {
  const courseData = [
    {
      id: 'course-1',
      courseType: 'th',
      courseCode: 'CSE1001',
      courseName: 'Problem Solving',
      courseSlots: [
        {
          slotName: 'A1',
          slotFaculties: [{ facultyName: 'Prof 1', venue: 'SJT101' }],
        },
      ],
    },
    {
      id: 'course-2',
      courseType: 'th',
      courseCode: 'CSE1002',
      courseName: 'Data Structures',
      courseSlots: [
        {
          slotName: 'A1',
          slotFaculties: [
            { facultyName: 'Faculty Conflicting 1', venue: 'SJT201' },
            { facultyName: 'Faculty Conflicting 2', venue: 'SJT202' },
          ],
        },
      ],
    },
  ];

  const onResult = generateTT(courseData, true);

  assert.equal(onResult.result.length, 0);
  assert.ok(onResult.clashes !== null);
  assert.ok(onResult.clashes.includes('A1'));
  assert.ok(onResult.skippedCourses.includes('CSE1001'));
  assert.ok(onResult.skippedCourses.includes('CSE1002'));
});

test('no valid full timetable with All Subjects OFF generates valid partial combinations without duplicates', () => {
  const courseData = [
    {
      id: 'course-1',
      courseType: 'th',
      courseCode: 'MAT1001',
      courseName: 'Calculus',
      courseSlots: [
        {
          slotName: 'A1',
          slotFaculties: [{ facultyName: 'Prof Math', venue: 'TT101' }],
        },
      ],
    },
    {
      id: 'course-2',
      courseType: 'th',
      courseCode: 'PHY1001',
      courseName: 'Physics',
      courseSlots: [
        {
          slotName: 'A1',
          slotFaculties: [
            { facultyName: 'Prof Physics 1', venue: 'TT201' },
            { facultyName: 'Prof Physics 2', venue: 'TT202' },
          ],
        },
      ],
    },
    {
      id: 'course-3',
      courseType: 'th',
      courseCode: 'CHY1001',
      courseName: 'Chemistry',
      courseSlots: [
        {
          slotName: 'B1',
          slotFaculties: [{ facultyName: 'Prof Chem', venue: 'TT301' }],
        },
      ],
    },
  ];

  const onResult = generateTT(courseData, true);
  assert.equal(
    onResult.result.length,
    0,
    'Should not generate full timetable when clash exists in ON mode'
  );

  const offResult = generateTT(courseData, false);
  // MAT1001 and CHY1001 can fit together (A1 and B1), while PHY1001 is skipped.
  assert.equal(offResult.result.length, 1);
  const timetable = offResult.result[0];
  const includedCodes = timetable.map(c => c.courseCode);
  assert.ok(includedCodes.includes('MAT1001'));
  assert.ok(includedCodes.includes('CHY1001'));
  assert.equal(includedCodes.includes('PHY1001'), false);

  assert.deepEqual(offResult.skippedCourses, ['PHY1001']);
});

test('partial combinations with both fitting and conflicting options avoid duplicate branches', () => {
  const courseData = [
    {
      id: 'course-1',
      courseType: 'th',
      courseCode: 'ENG1001',
      courseName: 'English',
      courseSlots: [
        {
          slotName: 'A1',
          slotFaculties: [{ facultyName: 'Prof Eng', venue: 'SJT101' }],
        },
      ],
    },
    {
      id: 'course-2',
      courseType: 'th',
      courseCode: 'HUM1001',
      courseName: 'Ethics',
      courseSlots: [
        {
          slotName: 'A1',
          slotFaculties: [
            { facultyName: 'Prof Clash 1', venue: 'SJT102' },
            { facultyName: 'Prof Clash 2', venue: 'SJT103' },
          ],
        },
        {
          slotName: 'C1',
          slotFaculties: [{ facultyName: 'Prof NonClash', venue: 'SJT104' }],
        },
      ],
    },
  ];

  const offResult = generateTT(courseData, false);
  // We should have:
  // 1. [ENG1001 (A1), HUM1001 (C1)]
  // 2. [ENG1001 (A1)] (from skipping HUM1001 because A1 clashed)
  // There should NOT be multiple duplicate copies of [ENG1001 (A1)].
  assert.equal(offResult.result.length, 2);

  const lengths = offResult.result.map(r => r.length).sort();
  assert.deepEqual(lengths, [1, 2]);
});
