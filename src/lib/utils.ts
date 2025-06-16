import { clashMap } from "./slots";
import { fullCourseData, timetableDisplayData } from "./type";

export function generateTT(courseData: fullCourseData[], discardClashCombinations: boolean = true): timetableDisplayData[][] {

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
    const temp: timetableDisplayData[][] = [];
    for (const partial of combinations) {
      for (const item of subject) {
        const included: string[] = [];
        partial.forEach(p => {
          const slots = p.slotName.split(/\+|__/);
          slots.forEach(slot => {
            included.push(slot);
            if (clashMap[slot]) included.push(...clashMap[slot]);
          });
        });
        const nonePresent = item.slotName.split(/\+|__/).every(slot => !included.includes(slot));
        if (nonePresent) temp.push([...partial, item]);
        else if (!discardClashCombinations) temp.push([...partial])
      }
    }
    combinations = temp;
  }
  return breakClubbed(combinations);
}
