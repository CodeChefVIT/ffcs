"use client";
import React, { useEffect, useState } from "react";
import FacultyTable from "./components/FacultyTable";
import TimeTable from "./components/TimeTable";
import { IFacultyData, slot } from "./type";

function convertToSlot(timetable: IFacultyData[]): slot[] {
  const slotMap: Record<string, slot[]> = {
    'A1': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TA1': [{ row: 0, colStart: 0, colEnd: 0 }],
    'TAA1': [{ row: 0, colStart: 0, colEnd: 0 }],
    'B1': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TB1': [{ row: 0, colStart: 0, colEnd: 0 }],
    'C1': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TC1': [{ row: 0, colStart: 0, colEnd: 0 }],
    'TCC1': [{ row: 0, colStart: 0, colEnd: 0 }],
    'D1': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TD1': [{ row: 0, colStart: 0, colEnd: 0 }],
    'E1': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TE1': [{ row: 0, colStart: 0, colEnd: 0 }],
    'F1': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TF1': [{ row: 0, colStart: 0, colEnd: 0 }],
    'G1': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TG1': [{ row: 0, colStart: 0, colEnd: 0 }],

    'A2': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TA2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'TAA2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'B2': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TB2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'TBB2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'C2': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TC2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'TCC2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'D2': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TD2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'TDD2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'E2': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TE2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'F2': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TF2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'G2': [{ row: 0, colStart: 0, colEnd: 0 }, { row: 0, colStart: 0, colEnd: 0 }],
    'TG2': [{ row: 0, colStart: 0, colEnd: 0 }],

    'L1+L2': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L3+L4': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L5+L6': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L7+L8': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L9+L10': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L11+L12': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L13+L14': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L15+L16': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L17+L18': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L19+L20': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L21+L22': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L23+L24': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L25+L26': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L27+L28': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L29+L30': [{ row: 0, colStart: 0, colEnd: 0 }],

    'L31+L32': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L33+L34': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L35+L36': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L37+L38': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L39+L40': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L41+L42': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L43+L44': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L45+L46': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L47+L48': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L49+L50': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L51+L52': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L53+L54': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L55+L56': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L57+L58': [{ row: 0, colStart: 0, colEnd: 0 }],
    'L59+L60': [{ row: 0, colStart: 0, colEnd: 0 }],
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
