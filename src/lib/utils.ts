import { clashMap } from "./slots";
import { fullCourseData, timetableDisplayData } from "./type";

export function generateTT(
  courseData: fullCourseData[],
  discardClashCombinations: boolean = true
): {
  result: timetableDisplayData[][];
  clashes: string | null;
} {
  function simplify(data: fullCourseData[]): timetableDisplayData[][] {
    const coursesSimple: timetableDisplayData[][] = [];
    for (const course of data) {
      const subjectOptions: timetableDisplayData[] = [];
      if (course.courseType === "th" || course.courseType === "lab") {
        for (const slot of course.courseSlots) {
          for (const faculty of slot.slotFaculties) {
            subjectOptions.push({
              courseCode: course.courseCode,
              courseName: course.courseName,
              slotName: slot.slotName,
              facultyName: faculty.facultyName,
            });
          }
        }
      } else if (course.courseType === "both") {
        for (const slot of course.courseSlots) {
          for (const faculty of slot.slotFaculties) {
            if (faculty.facultyLabSlot) {
              const labSlots = faculty.facultyLabSlot.split(", ");
              for (const labSlot of labSlots) {
                subjectOptions.push({
                  courseCode: course.courseCode + "__" + course.courseCodeLab,
                  courseName: course.courseName + "__" + course.courseNameLab,
                  slotName: slot.slotName + "__" + labSlot,
                  facultyName: faculty.facultyName,
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

  for (const subject of subjectList) {
    const temp: timetableDisplayData[][] = [];
    for (const partial of combinations) {
      for (const item of subject) {
        const includedSlots: string[] = [];

        partial.forEach((p) => {
          const slots = p.slotName.split(/\+|__/);
          slots.forEach((slot) => {
            includedSlots.push(slot);
            if (clashMap[slot]) includedSlots.push(...clashMap[slot]);
          });
        });

        const currentSlots = item.slotName.split(/\+|__/);
        const hasClash = currentSlots.some((slot) =>
          includedSlots.includes(slot)
        );

        if (!hasClash) {
          temp.push([...partial, item]);
        } else if (!discardClashCombinations) {
          temp.push([...partial]);
        } else {
          partial.forEach((p) => {
            const slotsA = p.slotName.split(/\+|__/);
            const slotsB = item.slotName.split(/\+|__/);

            const expandedA = new Set<string>();
            const expandedB = new Set<string>();

            slotsA.forEach((s) => {
              expandedA.add(s);
              if (clashMap[s]) clashMap[s].forEach((x) => expandedA.add(x));
            });

            slotsB.forEach((s) => {
              expandedB.add(s);
              if (clashMap[s]) clashMap[s].forEach((x) => expandedB.add(x));
            });

            for (const slotA of expandedA) {
              if (expandedB.has(slotA)) {
                const msg1 = `${p.facultyName} for (${p.courseName})`;
                const msg2 = `${item.facultyName} for (${item.courseName})`;

                const key = [p.facultyName, item.facultyName].sort().join("|");
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
      }
    }
    combinations = temp;
  }

  const final = breakClubbed(combinations);

  let clashMessage: string | null = null;

  if (final.length === 0 && clashGroups.size > 0) {
    clashMessage = `No timetables due to conflicting combinations:`;

    for (const [slot, conflicts] of clashGroups.entries()) {
      const expandedSlots = Array.from(
        new Set([slot, ...(clashMap[slot] || [])])
      ).join(", ");
      clashMessage += `\n  Slots (${expandedSlots})\n`;
      clashMessage += Array.from(conflicts)
        .map((entry) => `    ${entry}`)
        .join("\n");
      clashMessage += "\n";
    }

    clashMessage = clashMessage.trim();
  }

  return {
    result: final,
    clashes: clashMessage,
  };
}

function breakClubbed(
  combinations: timetableDisplayData[][]
): timetableDisplayData[][] {
  return combinations.map((combo) =>
    combo.flatMap((item: timetableDisplayData): timetableDisplayData[] => {
      if (item.slotName.includes("__")) {
        const [thSlot, labSlots] = item.slotName.split("__");
        const [thCode, labCode] = item.courseCode.split("__");
        const [thName, labName] = item.courseName.split("__");
        return [
          {
            courseCode: thCode,
            courseName: thName,
            slotName: thSlot,
            facultyName: item.facultyName,
          },
          {
            courseCode: labCode,
            courseName: labName,
            slotName: labSlots,
            facultyName: item.facultyName,
          },
        ];
      }
      return [item];
    })
  );
}

export function getCurrentDateTime() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
