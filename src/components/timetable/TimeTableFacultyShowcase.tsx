"use client";
import React, { useEffect, useState } from "react";
import FacultyTable from "./components/FacultyTable";
import TimeTable from "./components/TimeTable";
import { IFacultyData, slot } from "./type";

function convertToSlot(timetable: IFacultyData[]): slot[] {

  function mergeSlots(target: Record<string, slot[]>, newKey: string, keysToMerge: string[]) {
    target[newKey] = keysToMerge.flatMap(key => target[key] || []);
  }
  const slotMap: Record<string, slot[]> = {
    'A1': [{ row: 4, colStart: 2, colEnd: 7, slotName: 'A1' }, { row: 10, colStart: 8, colEnd: 13, slotName: 'A1' }],
    'TA1': [{ row: 16, colStart: 14, colEnd: 19, slotName: 'TA1' }],
    'TAA1': [{ row: 7, colStart: 26, colEnd: 31, slotName: 'TAA1' }],
    'B1': [{ row: 7, colStart: 2, colEnd: 7, slotName: 'B1' }, { row: 13, colStart: 8, colEnd: 13, slotName: 'B1' }],
    'TB1': [{ row: 4, colStart: 20, colEnd: 25, slotName: 'TB1' }],
    'C1': [{ row: 10, colStart: 2, colEnd: 7, slotName: 'C1' }, { row: 16, colStart: 8, colEnd: 13, slotName: 'C1' }],
    'TC1': [{ row: 7, colStart: 20, colEnd: 25, slotName: 'TC1' }],
    'TCC1': [{ row: 13, colStart: 26, colEnd: 31, slotName: 'TCC1' }],
    'D1': [{ row: 13, colStart: 2, colEnd: 7, slotName: 'D1' }, { row: 4, colStart: 14, colEnd: 19, slotName: 'D1' }],
    'TD1': [{ row: 16, colStart: 26, colEnd: 31, slotName: 'TD1' }],
    'E1': [{ row: 16, colStart: 2, colEnd: 7, slotName: 'E1' }, { row: 7, colStart: 14, colEnd: 19, slotName: 'E1' }],
    'TE1': [{ row: 13, colStart: 20, colEnd: 25, slotName: 'TE1' }],
    'F1': [{ row: 4, colStart: 8, colEnd: 13, slotName: 'F1' }, { row: 10, colStart: 14, colEnd: 19, slotName: 'F1' }],
    'TF1': [{ row: 16, colStart: 20, colEnd: 25, slotName: 'TF1' }],
    'G1': [{ row: 7, colStart: 8, colEnd: 13, slotName: 'G1' }, { row: 13, colStart: 14, colEnd: 19, slotName: 'G1' }],
    'TG1': [{ row: 4, colStart: 26, colEnd: 31, slotName: 'TG1' }],

    'A2': [{ row: 4, colStart: 38, colEnd: 43, slotName: 'A2' }, { row: 10, colStart: 44, colEnd: 49, slotName: 'A2' }],
    'TA2': [{ row: 16, colStart: 50, colEnd: 55, slotName: 'TA2' }],
    'TAA2': [{ row: 7, colStart: 62, colEnd: 67, slotName: 'TAA2' }],
    'B2': [{ row: 7, colStart: 38, colEnd: 43, slotName: 'B2' }, { row: 13, colStart: 44, colEnd: 49, slotName: 'B2' }],
    'TB2': [{ row: 4, colStart: 56, colEnd: 61, slotName: 'TB2' }],
    'TBB2': [{ row: 10, colStart: 62, colEnd: 67, slotName: 'TBB2' }],
    'C2': [{ row: 10, colStart: 38, colEnd: 43, slotName: 'C2' }, { row: 16, colStart: 44, colEnd: 49, slotName: 'C2' }],
    'TC2': [{ row: 7, colStart: 56, colEnd: 61, slotName: 'TC2' }],
    'TCC2': [{ row: 13, colStart: 62, colEnd: 67, slotName: 'TCC2' }],
    'D2': [{ row: 13, colStart: 38, colEnd: 43, slotName: 'D2' }, { row: 4, colStart: 50, colEnd: 55, slotName: 'D2' }],
    'TD2': [{ row: 10, colStart: 56, colEnd: 61, slotName: 'TD2' }],
    'TDD2': [{ row: 16, colStart: 62, colEnd: 67, slotName: 'TDD2' }],
    'E2': [{ row: 16, colStart: 38, colEnd: 43, slotName: 'E2' }, { row: 7, colStart: 50, colEnd: 55, slotName: 'E2' }],
    'TE2': [{ row: 13, colStart: 56, colEnd: 61, slotName: 'TE2' }],
    'F2': [{ row: 4, colStart: 44, colEnd: 49, slotName: 'F2' }, { row: 10, colStart: 50, colEnd: 55, slotName: 'F2' }],
    'TF2': [{ row: 16, colStart: 56, colEnd: 61, slotName: 'TF2' }],
    'G2': [{ row: 7, colStart: 44, colEnd: 49, slotName: 'G2' }, { row: 13, colStart: 50, colEnd: 55, slotName: 'G2' }],
    'TG2': [{ row: 4, colStart: 62, colEnd: 67, slotName: 'TG2' }],

    'L1+L2': [{ row: 5, colStart: 2, colEnd: 12, slotName: 'L1+L2' }],
    'L3+L4': [{ row: 5, colStart: 13, colEnd: 23, slotName: 'L3+L4' }],
    'L5+L6': [{ row: 5, colStart: 24, colEnd: 34, slotName: 'L5+L6' }],
    'L7+L8': [{ row: 8, colStart: 2, colEnd: 12, slotName: 'L7+L8' }],
    'L9+L10': [{ row: 8, colStart: 13, colEnd: 23, slotName: 'L9+L10' }],
    'L11+L12': [{ row: 8, colStart: 24, colEnd: 34, slotName: 'L11+L12' }],
    'L13+L14': [{ row: 11, colStart: 2, colEnd: 12, slotName: 'L13+L14' }],
    'L15+L16': [{ row: 11, colStart: 13, colEnd: 23, slotName: 'L15+L16' }],
    'L17+L18': [{ row: 11, colStart: 24, colEnd: 34, slotName: 'L17+L18' }],
    'L19+L20': [{ row: 14, colStart: 2, colEnd: 12, slotName: 'L19+L20' }],
    'L21+L22': [{ row: 14, colStart: 13, colEnd: 23, slotName: 'L21+L22' }],
    'L23+L24': [{ row: 14, colStart: 24, colEnd: 34, slotName: 'L23+L24' }],
    'L25+L26': [{ row: 17, colStart: 2, colEnd: 12, slotName: 'L25+L26' }],
    'L27+L28': [{ row: 17, colStart: 13, colEnd: 23, slotName: 'L27+L28' }],
    'L29+L30': [{ row: 17, colStart: 24, colEnd: 34, slotName: 'L29+L30' }],

    'L31+L32': [{ row: 5, colStart: 38, colEnd: 48, slotName: 'L31+L32' }],
    'L33+L34': [{ row: 5, colStart: 49, colEnd: 59, slotName: 'L33+L34' }],
    'L35+L36': [{ row: 5, colStart: 69, colEnd: 70, slotName: 'L35+L36' }],
    'L37+L38': [{ row: 8, colStart: 38, colEnd: 48, slotName: 'L37+L38' }],
    'L39+L40': [{ row: 8, colStart: 49, colEnd: 59, slotName: 'L39+L40' }],
    'L41+L42': [{ row: 8, colStart: 69, colEnd: 70, slotName: 'L41+L42' }],
    'L43+L44': [{ row: 11, colStart: 38, colEnd: 48, slotName: 'L43+L44' }],
    'L45+L46': [{ row: 11, colStart: 49, colEnd: 59, slotName: 'L45+L46' }],
    'L47+L48': [{ row: 11, colStart: 69, colEnd: 70, slotName: 'L47+L48' }],
    'L49+L50': [{ row: 14, colStart: 38, colEnd: 48, slotName: 'L49+L50' }],
    'L51+L52': [{ row: 14, colStart: 49, colEnd: 59, slotName: 'L51+L52' }],
    'L53+L54': [{ row: 14, colStart: 69, colEnd: 70, slotName: 'L53+L54' }],
    'L55+L56': [{ row: 17, colStart: 38, colEnd: 48, slotName: 'L55+L56' }],
    'L57+L58': [{ row: 17, colStart: 49, colEnd: 59, slotName: 'L57+L58' }],
    'L59+L60': [{ row: 17, colStart: 69, colEnd: 70, slotName: 'L59+L60' }],
  };

  mergeSlots(slotMap, 'A1+TA1', ['A1', 'TA1']);
  mergeSlots(slotMap, 'A1+TA1+TAA1', ['A1', 'TA1', 'TAA1']);
  mergeSlots(slotMap, 'B1+TB1', ['B1', 'TB1']);
  mergeSlots(slotMap, 'C1+TC1', ['C1', 'TC1']);
  mergeSlots(slotMap, 'C1+TC1+TCC1', ['C1', 'TC1', 'TCC1']);
  mergeSlots(slotMap, 'D1+TD1', ['D1', 'TD1']);
  mergeSlots(slotMap, 'E1+TE1', ['E1', 'TE1']);
  mergeSlots(slotMap, 'F1+TF1', ['F1', 'TF1']);
  mergeSlots(slotMap, 'G1+TG1', ['G1', 'TG1']);
  mergeSlots(slotMap, 'A2+TA2', ['A2', 'TA2']);
  mergeSlots(slotMap, 'A2+TA2+TAA2', ['A2', 'TA2', 'TAA2']);
  mergeSlots(slotMap, 'B2+TB2', ['B2', 'TB2']);
  mergeSlots(slotMap, 'B2+TB2+TBB2', ['B2', 'TB2', 'TBB2']);
  mergeSlots(slotMap, 'C2+TC2', ['C2', 'TC2']);
  mergeSlots(slotMap, 'C2+TC2+TCC2', ['C2', 'TC2', 'TCC2']);
  mergeSlots(slotMap, 'D2+TD2', ['D2', 'TD2']);
  mergeSlots(slotMap, 'D2+TD2+TDD2', ['D2', 'TD2', 'TDD2']);
  mergeSlots(slotMap, 'E2+TE2', ['E2', 'TE2']);
  mergeSlots(slotMap, 'F2+TF2', ['F2', 'TF2']);
  mergeSlots(slotMap, 'G2+TG2', ['G2', 'TG2']);

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
