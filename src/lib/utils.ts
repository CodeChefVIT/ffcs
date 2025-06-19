import { getGlobalCourses } from "./globalCourses";
import { clashMap } from "./slots";
import { fullCourseData, timetableDisplayData } from "./type";
import ExcelJS from "exceljs";

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
            subjectOptions.push({
              courseCode: course.courseCode + "__" + course.courseCodeLab,
              courseName: course.courseName + "__" + course.courseNameLab,
              slotName: slot.slotName + "__" + faculty.facultyLabSlot,
              facultyName: faculty.facultyName,
            });
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
    clashMessage = ` No valid timetables due to slot clashes.\nConflicting combinations:`;

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

export const exportToExcel = async () => {
  const courses: fullCourseData[] = getGlobalCourses();

  if (!courses || courses.length === 0) {
    throw new Error("No course data available to export.");
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Faculty Slots");

  const header = ['Course Name', 'Faculty', 'Theory Slot', 'Lab Slot', 'Notes'];
  const headerRow = sheet.addRow(header);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF0F0F0' },
  };
  headerRow.eachCell((cell) => {
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FF000000' } }
    };
  });
  sheet.addRow([]); // Add an empty row for spacing
  sheet.addRow([]); // Add an empty row for spacing

  courses.forEach((course) => {
    const courseLabel =
      course.courseType === 'both'
        ? `${course.courseName} & Lab`
        : course.courseName;

    course.courseSlots.forEach((slot, idx1) => {
      const isFirstSubjectRow = idx1 === 0;
      slot.slotFaculties.forEach((faculty, idx2) => {
        const isFirstFacultyRow = idx2 === 0;

        const theorySlot = (course.courseType === 'th' || course.courseType === 'both') ? slot.slotName : "";
        const labSlot = (course.courseType === 'lab') ? slot.slotName : faculty.facultyLabSlot ?? "";

        sheet.addRow([
          isFirstSubjectRow && isFirstFacultyRow ? courseLabel : '',
          faculty.facultyName,
          theorySlot,
          labSlot,
        ]);
      });
    });
    sheet.addRow([]);
    sheet.addRow([]);
  });

  sheet.columns.forEach((col) => {
    let max = 10;
    col.eachCell?.((cell) => {
      const len = cell.value?.toString().length ?? 0;
      max = Math.max(max, len + 2);
    });
    col.width = max;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "faculty-slots.xlsx";
  a.click();
  URL.revokeObjectURL(url);
};
