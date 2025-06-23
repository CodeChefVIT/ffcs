import { getGlobalCourses } from "./globalCourses";
import { clashMap } from "./slots";
import { fullCourseData, timetableDisplayData } from "./type";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

export const exportToPDF = async () => {
  const courses: fullCourseData[] = getGlobalCourses();

  if (!courses || courses.length === 0) {
    throw new Error("No course data available to export.");
  }

  const doc = new jsPDF({ orientation: "landscape" });
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const dateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  doc.setFillColor(166, 213, 215);
  doc.rect(
    0,
    0,
    doc.internal.pageSize.getWidth(),
    doc.internal.pageSize.getHeight(),
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Faculty Slot Allocation", 14, 16);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`Exported on: ${dateTime}`, 14, 24);

  const tableBody: string[][] = [];

  for (const course of courses) {
    const courseLabel =
      course.courseType === "both"
        ? `${course.courseName} & Lab`
        : course.courseName;

    for (const slot of course.courseSlots) {
      for (const faculty of slot.slotFaculties) {
        const theorySlot =
          course.courseType === "th" || course.courseType === "both"
            ? slot.slotName
            : "";
        const labSlot =
          course.courseType === "lab"
            ? slot.slotName
            : faculty.facultyLabSlot ?? "";

        const labSlots = labSlot.split(", ");
        for (const lab of labSlots) {
          const notes: string[] = [];

          const clashKey = [...theorySlot.split("+"), ...lab.split("+")];
          for (const row of tableBody) {
            const rowTheory = row[2] || "";
            const rowLab = row[3] || "";
            const existingSlots = [
              ...rowTheory.split("+"),
              ...rowLab.split("+"),
            ];

            const occupiedSlots: string[] = [];
            for (const s of existingSlots) {
              if (clashMap[s]) {
                occupiedSlots.push(...clashMap[s]);
              }
            }

            if (
              clashKey.some((slot) => occupiedSlots.includes(slot)) ||
              clashKey.some((slot) => existingSlots.includes(slot))
            ) {
              notes.push(row[1] || "");
            }
          }

          tableBody.push([
            courseLabel,
            faculty.facultyName,
            theorySlot,
            lab,
            notes.join(", "),
          ]);
        }
      }
    }

    tableBody.push(["", "", "", "", ""]);
  }

  doc.setFillColor(219, 238, 239);
  doc.rect(10, 28, 277, 160, "F");

  autoTable(doc, {
    head: [
      ["Course Name", "Faculty", "Theory Slot", "Lab Slot", "Clashes with"],
    ],
    body: tableBody,
    styles: {
      fontSize: 8,
      font: "helvetica",
      textColor: [0, 0, 0],
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      halign: "left",
      valign: "middle",
      fillColor: false,
    },
    headStyles: {
      fillColor: [166, 213, 215],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      font: "helvetica",
      halign: "center",
      valign: "middle",
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: false,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "left" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "left" },
    },
    tableWidth: "auto",
    startY: 30,
    theme: "striped",
    didDrawPage: () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("FFCS-inator by CodeChefVIT", 14, 200, {
        align: "left",
      });

      const pageCount = (
        doc as jsPDF & { internal: { getNumberOfPages: () => number } }
      ).internal.getNumberOfPages();

      doc.text(`Page ${pageCount}`, 285 - 14, 200, {
        align: "right",
      });
    },
    margin: { top: 30, left: 12, right: 12 },
  });

  doc.save(`timetable_${dateTime.replace(/[: ]/g, "_")}.pdf`);
};
