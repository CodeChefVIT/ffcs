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


export const exportToExcel = async () => {
  const courses: fullCourseData[] = getGlobalCourses();

  if (!courses || courses.length === 0) {
    throw new Error("No course data available to export.");
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Faculty Slots");

  const header = ['Course Name', '', 'Faculty', '', 'Theory Slot', 'Lab Slot', '', 'Clashes with', '', ''];
  const headerRow = sheet.addRow(header);
  headerRow.font = { bold: true, size: 14 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF0F0F0' },
  };
  headerRow.eachCell((cell) => {
    cell.border = {
      bottom: { style: 'thick', color: { argb: 'FF000000' } }
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

        labSlot.split(", ").forEach((lab, idx3) => {

          const notes: string[] = [];
          const currentTheorySlot = theorySlot;
          const currentLabSlot = lab;

          const clashKey = [...currentTheorySlot.split("+"), ...currentLabSlot.split("+")];

          const previousRows = sheet.getRows(2, sheet.rowCount - 1);
          if (previousRows) {
            previousRows.forEach((row) => {

              const rowTheorySlot = row.getCell(5).value?.toString() || "";
              const rowLabSlot = row.getCell(6).value?.toString() || "";
              const clashCheck = [...rowTheorySlot.split("+"), ...rowLabSlot.split("+")]

              const occupiedSlots: string[] = []
              clashCheck.forEach((slot) => {
                if (clashMap[slot]) {
                  occupiedSlots.push(...clashMap[slot]);
                }
              })

              if (
                clashKey.some((slot) => occupiedSlots.includes(slot)) ||
                clashKey.some((slot) => clashCheck.includes(slot)) &&
                row.getCell(1).value?.toString() !== courseLabel
              ) {
                const rowFaculty = row.getCell(3).value?.toString() || "";
                notes.push(rowFaculty)
              }

            });
          }

          const notesStr = notes.join(", ");

          const isFirst = isFirstSubjectRow && isFirstFacultyRow && idx3 === 0;
          const courseLabelValue = courseLabel; // Always put the subject name

          const newRow = sheet.addRow([
            courseLabelValue,
            '',
            faculty.facultyName,
            '',
            theorySlot,
            lab,
            '',
            notesStr
          ]);

          if (isFirst) newRow.getCell(1).font = { color: { argb: 'FF000000' }, bold: true };
          else newRow.getCell(1).font = { color: { argb: 'FFFFFFFF' } };

          newRow.getCell(8).font = { color: { argb: 'FFFF0000' }, bold: true };

        })
      });
    });
    sheet.addRow([]);
    sheet.addRow([]);
  });



  sheet.columns.forEach((col, idx) => {
    let max = 2;
    col.eachCell?.((cell) => {
      const len = cell.value?.toString().length ?? 0;
      max = Math.max(max, len + 5);
    });
    col.width = max;
    if (idx === 0) {
      col.border = {
        right: { style: 'thick', color: { argb: 'FF000000' } }
      };
      // Set border for the first cell in the column if it exists and is a cell object
      const firstCellObj = sheet.getCell(1, idx + 1);
      firstCellObj.border = {
        right: { style: 'thick', color: { argb: 'FF000000' } },
        bottom: { style: 'thick', color: { argb: 'FF000000' } }
      };
      firstCellObj.font = { bold: true, size: 14 };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "report.xlsx";
  a.click();
  URL.revokeObjectURL(url);
};
