import { clashMap } from "./slots";
import { fullCourseData, timetableDisplayData } from "./type";

export function generateTT(courseData: fullCourseData[]) {

  function slotClashes(slotStr: string, usedSlots: Set<string>): boolean {
    const parts = slotStr.split(/[\+__]/);
    for (const part of parts) {
      for (const used of usedSlots) {
        const usedParts = used.split(/[\+__]/);
        for (const u of usedParts) {
          if (
            u === part ||
            clashMap[u]?.includes(part) ||
            clashMap[part]?.includes(u)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

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
              facultyName: faculty.facultyName
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
              facultyName: faculty.facultyName
            });
          }
        }
      }
      coursesSimple.push(subjectOptions);
    }
    return coursesSimple;
  }

  function breakClubbed(combinations: timetableDisplayData[][]): timetableDisplayData[][] {
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
            }
          ];
        }
        return [item];
      })
    );
  }

  const subjectList = simplify(courseData);
  let combinations: timetableDisplayData[][] = [[]];
  for (const subject of subjectList) {
    const nextCombinations: timetableDisplayData[][] = [];
    for (const combo of combinations) {
      const usedSlots = new Set(combo.map(item => item.slotName));
      let added = false;
      for (const item of subject) {
        if (!slotClashes(item.slotName, usedSlots)) {
          nextCombinations.push([...combo, item]);
          added = true;
        }
      }
      if (!added) {
        nextCombinations.push(combo);
      }
    }
    combinations = nextCombinations;
  }
  return breakClubbed(combinations);
}
