import { getGlobalCourses } from "./globalCourses";
import { clashMap } from "./slots";
import { fullCourseData, timetableDisplayData } from "./type";
import ExcelJS from "exceljs";

export function generateTT(
  courseData: fullCourseData[],
  discardClashCombinations: boolean = true
): timetableDisplayData[][] {
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
      }
      if (course.courseType === "both") {
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

  const subjectList = simplify(courseData);
  let combinations: timetableDisplayData[][] = [[]];
  for (const subject of subjectList) {
    const temp: timetableDisplayData[][] = [];
    for (const partial of combinations) {
      for (const item of subject) {
        const included: string[] = [];
        partial.forEach((p) => {
          const slots = p.slotName.split(/\+|__/);
          slots.forEach((slot) => {
            included.push(slot);
            if (clashMap[slot]) included.push(...clashMap[slot]);
          });
        });
        const nonePresent = item.slotName
          .split(/\+|__/)
          .every((slot) => !included.includes(slot));
        if (nonePresent) temp.push([...partial, item]);
        else if (!discardClashCombinations) temp.push([...partial]);
      }
    }
    combinations = temp;
  }
  return breakClubbed(combinations);
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
    throw new Error('No course data available to export.');
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Faculty Slots');

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
        const labSlot = (course.courseType === 'lab') ? slot.slotName : faculty.facultyLabSlot ?? 'NIL';

        sheet.addRow([
          isFirstSubjectRow && isFirstFacultyRow ? courseLabel : '',
          faculty.facultyName,
          theorySlot,
          labSlot,
        ]);
      });
    });
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
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'faculty-slots.xlsx';
  a.click();
  URL.revokeObjectURL(url);
};