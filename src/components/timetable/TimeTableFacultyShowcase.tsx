"use client";
import React, { useEffect, useState } from "react";
import FacultyTable from "./components/FacultyTable";
import TimeTable from "./components/TimeTable";
import { IFacultyData, slot } from "./type";

function convertToSlot(timetable: IFacultyData[]): slot[] {
  const slotMap: Record<string, slot[]> = {
    'A1': [{ row: 4, colStart: 2, colEnd: 7 }, { row: 10, colStart: 8, colEnd: 13 }],
    'TA1': [{ row: 16, colStart: 14, colEnd: 19 }],
    'TAA1': [{ row: 7, colStart: 26, colEnd: 31 }],
    'B1': [{ row: 7, colStart: 2, colEnd: 7 }, { row: 13, colStart: 8, colEnd: 13 }],
    'TB1': [{ row: 4, colStart: 20, colEnd: 25 }],
    'C1': [{ row: 10, colStart: 2, colEnd: 7 }, { row: 16, colStart: 8, colEnd: 13 }],
    'TC1': [{ row: 7, colStart: 20, colEnd: 25 }],
    'TCC1': [{ row: 13, colStart: 26, colEnd: 31 }],
    'D1': [{ row: 13, colStart: 2, colEnd: 7 }, { row: 4, colStart: 14, colEnd: 19 }],
    'TD1': [{ row: 16, colStart: 26, colEnd: 31 }],
    'E1': [{ row: 16, colStart: 2, colEnd: 7 }, { row: 7, colStart: 14, colEnd: 19 }],
    'TE1': [{ row: 13, colStart: 20, colEnd: 25 }],
    'F1': [{ row: 4, colStart: 8, colEnd: 13 }, { row: 10, colStart: 14, colEnd: 19 }],
    'TF1': [{ row: 16, colStart: 20, colEnd: 25 }],
    'G1': [{ row: 7, colStart: 8, colEnd: 13 }, { row: 13, colStart: 14, colEnd: 19 }],
    'TG1': [{ row: 4, colStart: 26, colEnd: 31 }],

    'A2': [{ row: 4, colStart: 38, colEnd: 43 }, { row: 10, colStart: 44, colEnd: 49 }],
    'TA2': [{ row: 16, colStart: 50, colEnd: 55 }],
    'TAA2': [{ row: 7, colStart: 62, colEnd: 67 }],
    'B2': [{ row: 7, colStart: 38, colEnd: 43 }, { row: 13, colStart: 44, colEnd: 49 }],
    'TB2': [{ row: 4, colStart: 56, colEnd: 61 }],
    'TBB2': [{ row: 10, colStart: 62, colEnd: 67 }],
    'C2': [{ row: 10, colStart: 38, colEnd: 43 }, { row: 16, colStart: 44, colEnd: 49 }],
    'TC2': [{ row: 7, colStart: 56, colEnd: 61 }],
    'TCC2': [{ row: 13, colStart: 62, colEnd: 67 }],
    'D2': [{ row: 13, colStart: 38, colEnd: 43 }, { row: 4, colStart: 50, colEnd: 55 }],
    'TD2': [{ row: 10, colStart: 56, colEnd: 61 }],
    'TDD2': [{ row: 16, colStart: 62, colEnd: 67 }],
    'E2': [{ row: 16, colStart: 38, colEnd: 43 }, { row: 7, colStart: 50, colEnd: 55 }],
    'TE2': [{ row: 13, colStart: 56, colEnd: 61 }],
    'F2': [{ row: 4, colStart: 44, colEnd: 49 }, { row: 10, colStart: 50, colEnd: 55 }],
    'TF2': [{ row: 16, colStart: 56, colEnd: 61 }],
    'G2': [{ row: 7, colStart: 44, colEnd: 49 }, { row: 13, colStart: 50, colEnd: 55 }],
    'TG2': [{ row: 4, colStart: 62, colEnd: 67 }],

    'L1+L2': [{ row: 5, colStart: 2, colEnd: 12 }],
    'L3+L4': [{ row: 5, colStart: 13, colEnd: 23 }],
    'L5+L6': [{ row: 5, colStart: 24, colEnd: 34 }],
    'L7+L8': [{ row: 8, colStart: 2, colEnd: 12 }],
    'L9+L10': [{ row: 8, colStart: 13, colEnd: 23 }],
    'L11+L12': [{ row: 8, colStart: 24, colEnd: 34 }],
    'L13+L14': [{ row: 11, colStart: 2, colEnd: 12 }],
    'L15+L16': [{ row: 11, colStart: 13, colEnd: 23 }],
    'L17+L18': [{ row: 11, colStart: 24, colEnd: 34 }],
    'L19+L20': [{ row: 14, colStart: 2, colEnd: 12 }],
    'L21+L22': [{ row: 14, colStart: 13, colEnd: 23 }],
    'L23+L24': [{ row: 14, colStart: 24, colEnd: 34 }],
    'L25+L26': [{ row: 17, colStart: 2, colEnd: 12 }],
    'L27+L28': [{ row: 17, colStart: 13, colEnd: 23 }],
    'L29+L30': [{ row: 17, colStart: 24, colEnd: 34 }],

    'L31+L32': [{ row: 5, colStart: 38, colEnd: 48 }],
    'L33+L34': [{ row: 5, colStart: 49, colEnd: 59 }],
    'L35+L36': [{ row: 5, colStart: 69, colEnd: 70 }],
    'L37+L38': [{ row: 8, colStart: 38, colEnd: 48 }],
    'L39+L40': [{ row: 8, colStart: 49, colEnd: 59 }],
    'L41+L42': [{ row: 8, colStart: 69, colEnd: 70 }],
    'L43+L44': [{ row: 11, colStart: 38, colEnd: 48 }],
    'L45+L46': [{ row: 11, colStart: 49, colEnd: 59 }],
    'L47+L48': [{ row: 11, colStart: 69, colEnd: 70 }],
    'L49+L50': [{ row: 14, colStart: 38, colEnd: 48 }],
    'L51+L52': [{ row: 14, colStart: 49, colEnd: 59 }],
    'L53+L54': [{ row: 14, colStart: 69, colEnd: 70 }],
    'L55+L56': [{ row: 17, colStart: 38, colEnd: 48 }],
    'L57+L58': [{ row: 17, colStart: 49, colEnd: 59 }],
    'L59+L60': [{ row: 17, colStart: 69, colEnd: 70 }],
  };

  const slots: slot[] = [];
  console.log(timetable);

  for (const entry of timetable) {
    for (const slotName of entry.facultySlot) {
      const slotVal = slotMap[slotName];
      if (slotVal) {
        slots.push(...slotVal);
      }
    }
  }
  return slots;
}
export default function TimeTableFacultyShowcase({
  initialFacultyData,
}: {
  initialFacultyData: IFacultyData[];
}) {
  const [facultyData, setFacultyData] =
    useState<IFacultyData[]>(initialFacultyData);
  const [timetable, setTimetable] = useState<slot[]>([]);
  useEffect(() => {
    setTimetable(convertToSlot(facultyData));
  }, [facultyData]);
  useEffect(() => {
    setFacultyData(initialFacultyData);
  }, [initialFacultyData]);
  return (
    <div>
      <TimeTable data={timetable}></TimeTable>
      <div className="grid grid-cols-2 gap-4">
        <FacultyTable data={facultyData}></FacultyTable>
      </div>
    </div>
  );
}
