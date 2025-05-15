"use client";
import React, { useEffect, useState } from "react";
import FacultyTable from "./components/FacultyTable";
import TimeTable from "./components/TimeTable";
import { IFacultyData, slot } from "./type";

function convertToSlot(timetable: IFacultyData[]): slot[] {
  const slots: slot[] = [];
  console.log(timetable);
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
