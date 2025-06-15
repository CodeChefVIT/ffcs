import { timetableDisplayData } from "./type";

type fullCourseData = {
  id: string;
  courseType: "th" | "lab" | "both";
  courseCode: string;     // if th or lab
  courseName: string;     // if th or lab
  courseCodeLab?: string;      // if both
  courseNameLab?: string;      // if both
  courseSlots: {
    slotName: string;
    slotFaculties: {
      facultyName: string;
      facultyLabSlot?: string; // if both
    }[];
  }[];
}

const clashMap: Record<string, string[]> = {
  A1: ["L1", "L13"],
  TA1: ["L27"],
  TAA1: ["L11"],
  B1: ["L7", "L19"],
  TB1: ["L3", "L5"],
  C1: ["L13", "L25"],
  TC1: ["L9", "L11"],
  TCC1: ["L23"],
  D1: ["L3", "L19"],
  TD1: ["L29"],
  E1: ["L9", "L25"],
  TE1: ["L21", "L23"],
  F1: ["L1", "L15"],
  TF1: ["L27", "L29"],
  G1: ["L7", "L21"],
  TG1: ["L5"],

  A2: ["L31", "L43"],
  TA2: ["L57"],
  TAA2: ["L41"],
  B2: ["L37", "L49"],
  TB2: ["L33", "L35"],
  TBB2: ["L47"],
  C2: ["L43", "L55"],
  TC2: ["L39", "L41"],
  TCC2: ["L53"],
  D2: ["L33", "L49"],
  TD2: ["L45", "L47"],
  TDD2: ["L59"],
  E2: ["L39", "L55"],
  TE2: ["L51", "L53"],
  F2: ["L31", "L45"],
  TF2: ["L57", "L59"],
  G2: ["L37", "L51"],
  TG2: ["L35"],

  L1: ["A1", "F1"],
  L3: ["D1", "TB1"],
  L5: ["TB1", "TG1"],
  L7: ["B1", "G1"],
  L9: ["TC1", "E1"],
  L11: ["TAA1", "TC1"],
  L13: ["A1", "C1"],
  L15: ["F1"],
  L19: ["B1", "D1"],
  L21: ["TE1", "G1"],
  L23: ["TCC1", "TE1"],
  L25: ["C1", "E1"],
  L27: ["TA1", "TF1"],
  L29: ["TD1", "TF1"],

  L31: ["A2", "F2"],
  L33: ["D2", "TB2"],
  L35: ["TB2", "TG2"],
  L37: ["B2", "G2"],
  L39: ["TC2", "E2"],
  L41: ["TAA2", "TC2"],
  L43: ["A2", "C2"],
  L45: ["TD2", "F2"],
  L47: ["TBB2", "TD2"],
  L49: ["B2", "D2"],
  L51: ["TE2", "G2"],
  L53: ["TCC2", "TE2"],
  L55: ["C2", "E2"],
  L57: ["TA2", "TF2"],
  L59: ["TDD2", "TF2"]
};

// const courseData: fullCourseData[] = [
//   {
//     id: "course_1",
//     courseType: "both",
//     courseCode: "BCSE102L",
//     courseName: "Structured and Object-Oriented Programming",
//     courseCodeLab: "BCSE102P",
//     courseNameLab: "Structured and Object-Oriented Programming Lab",
//     courseSlots: [
//       {
//         slotName: "G1",
//         slotFaculties: [
//           { facultyName: "Fac 1", facultyLabSlot: "L31+L32" },
//           { facultyName: "Fac 2", facultyLabSlot: "L43+L44" },
//           { facultyName: "Fac 3", facultyLabSlot: "L53+L54" },
//           { facultyName: "Fac 4", facultyLabSlot: "L55+L56" },
//         ]
//       },
//       {
//         slotName: "F1",
//         slotFaculties: [
//           { facultyName: "Fac 5", facultyLabSlot: "L37+L38" },
//           { facultyName: "Fac 6", facultyLabSlot: "L39+L40" },
//           { facultyName: "Fac 7", facultyLabSlot: "L45+L46" },
//           { facultyName: "Fac 8", facultyLabSlot: "L59+L60" },
//         ]
//       },
//     ],
//   },
//   {
//     id: "course_2",
//     courseType: "th",
//     courseCode: "BCSE205L",
//     courseName: "Theory of Computation",
//     courseSlots: [
//       {
//         slotName: "A1+TA1",
//         slotFaculties: [
//           { facultyName: "Fac 9" },
//           { facultyName: "Fac 10" },
//           { facultyName: "Fac 11" },
//         ]
//       },
//       {
//         slotName: "F1+TF1",
//         slotFaculties: [
//           { facultyName: "Fac 12" },
//           { facultyName: "Fac 13" },

//         ]
//       },
//     ],
//   },
//   {
//     id: "course_3",
//     courseType: "lab",
//     courseCode: "BCSE301P",
//     courseName: "Database Management Systems Lab",
//     courseSlots: [
//       {
//         slotName: "L5+L6",
//         slotFaculties: [
//           { facultyName: "Fac 14" },
//           { facultyName: "Fac 15" },
//         ]
//       },
//       {
//         slotName: "L13+L14",
//         slotFaculties: [
//           { facultyName: "Fac 16" },
//         ]
//       },
//       {
//         slotName: "L21+L22",
//         slotFaculties: [
//           { facultyName: "Fac 17" },
//           { facultyName: "Fac 18" },
//         ]
//       },
//     ],
//   },
// ];

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

// const finalData = generateTT(courseData);
// // print all combinations
// console.log("Generated Timetable Combinations:");
// finalData.forEach((combo, index) => {
//   console.log(`Combination ${index + 1}:`);
//   combo.forEach(item => {
//     console.log(`  ${item.courseCode} - ${item.courseName} | Slot: ${item.slotName} | Faculty: ${item.facultyName}`);
//   });
// });

