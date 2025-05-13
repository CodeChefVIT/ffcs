import React, { useEffect, useState } from "react";
import FacultyTable from "./components/FacultyTable";
import TimeTable from "./components/TimeTable";

function convertToSlot(timetable: IFacultyData[][]): ITimeTable[] {
  const slots: ITimeTable[] = [];
  return slots;
}
export default function TimeTableFacultyShowcase({
  initialFacultyData,
}: {
  initialFacultyData: IFacultyData[][];
}) {
  const [facultyData, setFacultyData] =
    useState<IFacultyData[][]>(initialFacultyData);
  const [timetable, setTimetable] = useState<ITimeTable[]>([]);
  useEffect(() => {
    setTimetable(convertToSlot(initialFacultyData));
  }, []);
  return (
    <div>
      <TimeTable data={timetable}></TimeTable>
      <div className="grid grid-cols-2 gap-4">
        <FacultyTable data={facultyData}></FacultyTable>
      </div>
    </div>
  );
}
