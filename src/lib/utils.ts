import { clashMap } from './slots';
import { fullCourseData, timetableDisplayData } from './type';

function getComboKey(combo: timetableDisplayData[]): string {
  return combo
    .map(c => `${c.courseCode}#${c.slotName}#${c.facultyName}`)
    .sort()
    .join('||');
}

function deduplicateCombinations(combos: timetableDisplayData[][]): timetableDisplayData[][] {
  const seen = new Set<string>();
  const unique: timetableDisplayData[][] = [];
  for (const combo of combos) {
    const key = getComboKey(combo);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(combo);
    }
  }
  return unique;
}

export function generateTT(
  courseData: fullCourseData[],
  discardClashCombinations: boolean = true
): {
  result: timetableDisplayData[][];
  clashes: string | null;
  skippedCourses: string[];
} {
  function simplify(data: fullCourseData[]): timetableDisplayData[][] {
    const coursesSimple: timetableDisplayData[][] = [];
    for (const course of data) {
      const subjectOptions: timetableDisplayData[] = [];
      if (course.courseType === 'th' || course.courseType === 'lab') {
        for (const slot of course.courseSlots) {
          for (const faculty of slot.slotFaculties) {
            subjectOptions.push({
              courseCode: course.courseCode,
              courseName: course.courseName,
              slotName: slot.slotName,
              facultyName: faculty.facultyName,
              ...((faculty as { venue?: string }).venue
                ? { venue: (faculty as { venue?: string }).venue }
                : {}),
            });
          }
        }
      } else if (course.courseType === 'both') {
        // Embedded courses have no separate lab course, so their lab uses the course's own code and name.
        const labCode = course.courseCodeLab || course.courseCode;
        const labName = course.courseNameLab || course.courseName;
        for (const slot of course.courseSlots) {
          for (const faculty of slot.slotFaculties) {
            if (faculty.facultyLabSlot) {
              const labSlots = faculty.facultyLabSlot.split(', ');
              for (const labSlot of labSlots) {
                subjectOptions.push({
                  courseCode: course.courseCode + '__' + labCode,
                  courseName: course.courseName + '__' + labName,
                  slotName: slot.slotName + '__' + labSlot,
                  facultyName: faculty.facultyName,
                  labVenue: faculty.labVenues?.[labSlot],
                  ...((faculty as { venue?: string }).venue
                    ? { venue: (faculty as { venue?: string }).venue }
                    : {}),
                });
              }
            }
          }
        }
      }
      coursesSimple.push(subjectOptions);
    }
    return coursesSimple;
  }

  const subjectList = simplify(courseData);
  let combinations: timetableDisplayData[][] = [[]];
  const clashGroups: Map<string, Set<string>> = new Map();
  const seenPairs: Set<string> = new Set();

  function recordClash(partial: timetableDisplayData[], item: timetableDisplayData) {
    partial.forEach(p => {
      const slotsA = p.slotName.split(/\+|__/);
      const slotsB = item.slotName.split(/\+|__/);

      const expandedA = new Set<string>();
      const expandedB = new Set<string>();

      slotsA.forEach(s => {
        expandedA.add(s);
        if (clashMap[s]) clashMap[s].forEach(x => expandedA.add(x));
      });

      slotsB.forEach(s => {
        expandedB.add(s);
        if (clashMap[s]) clashMap[s].forEach(x => expandedB.add(x));
      });

      for (const slotA of expandedA) {
        if (expandedB.has(slotA)) {
          const msg1 = `${p.facultyName} for (${p.courseName})`;
          const msg2 = `${item.facultyName} for (${item.courseName})`;

          const key = [p.facultyName, item.facultyName].sort().join('|');
          if (seenPairs.has(key)) continue;

          seenPairs.add(key);

          if (!clashGroups.has(slotA)) {
            clashGroups.set(slotA, new Set());
          }

          clashGroups.get(slotA)!.add(msg1);
          clashGroups.get(slotA)!.add(msg2);
        }
      }
    });
  }

  for (const subject of subjectList) {
    const temp: timetableDisplayData[][] = [];
    for (const partial of combinations) {
      let addedForPartial = 0;
      let hadClashForPartial = false;

      for (const item of subject) {
        const includedSlots: string[] = [];

        partial.forEach(p => {
          const slots = p.slotName.split(/\+|__/);
          slots.forEach(slot => {
            includedSlots.push(slot);
            if (clashMap[slot]) includedSlots.push(...clashMap[slot]);
          });
        });

        const currentSlots = item.slotName.split(/\+|__/);
        const hasClash = currentSlots.some(slot => includedSlots.includes(slot));

        if (!hasClash) {
          temp.push([...partial, item]);
          addedForPartial++;
        } else {
          hadClashForPartial = true;
          recordClash(partial, item);
        }
      }

      if (!discardClashCombinations && (hadClashForPartial || addedForPartial === 0)) {
        temp.push([...partial]);
      }
    }
    combinations = deduplicateCombinations(temp);
  }

  const final = deduplicateCombinations(breakClubbed(combinations)).filter(
    combo => combo.length > 0
  );

  const skippedCourses: string[] = [];
  for (const course of courseData) {
    const isMissingFromAny =
      final.length === 0 ||
      final.some(combo => !combo.some(item => item.courseCode === course.courseCode));
    if (isMissingFromAny) {
      skippedCourses.push(course.courseCode);
    }
  }

  let clashMessage: string | null = null;

  if (final.length === 0 && clashGroups.size > 0) {
    clashMessage = `No timetables due to conflicting combinations:`;

    for (const [slot, conflicts] of clashGroups.entries()) {
      const expandedSlots = Array.from(new Set([slot, ...(clashMap[slot] || [])])).join(', ');
      clashMessage += `\n  Slots (${expandedSlots})\n`;
      clashMessage += Array.from(conflicts)
        .map(entry => `    ${entry}`)
        .join('\n');
      clashMessage += '\n';
    }

    clashMessage = clashMessage.trim();
  } else if (!discardClashCombinations && skippedCourses.length > 0 && final.length > 0) {
    const skippedNames = courseData
      .filter(c => skippedCourses.includes(c.courseCode))
      .map(c => `${c.courseName} (${c.courseCode})`)
      .join(', ');
    clashMessage = `Some courses could not be included in all combinations due to clashes: ${skippedNames}`;
  }

  return {
    result: final,
    clashes: clashMessage,
    skippedCourses,
  };
}

function breakClubbed(combinations: timetableDisplayData[][]): timetableDisplayData[][] {
  return combinations.map(combo =>
    combo.flatMap((item: timetableDisplayData): timetableDisplayData[] => {
      if (item.slotName.includes('__')) {
        const [thSlot, labSlots] = item.slotName.split('__');
        const [thCode, labCode] = item.courseCode.split('__');
        const [thName, labName] = item.courseName.split('__');
        return [
          {
            courseCode: thCode,
            courseName: thName,
            slotName: thSlot,
            facultyName: item.facultyName,
            venue: item.venue,
          },
          {
            courseCode: labCode,
            courseName: labName,
            slotName: labSlots,
            facultyName: item.facultyName,
            venue: item.labVenue,
          },
        ];
      }
      return [item];
    })
  );
}

export function getCurrentDateTime() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
