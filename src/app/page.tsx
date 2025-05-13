import TimeTableFacultyShowcase from "../components/timetable/TimeTableFacultyShowcase";

export default function Home() {
  const initialFacultyData = [
    [
      {
        faculty: "John Doe",
        facultySlot: [ "A2"],
        _id: "1",
      },
      {
        faculty: "Jane Smith",
        facultySlot: ["B2", "L1", "L2"],
        _id: "2",
      },
    ],
    [
      {
        faculty: "Alice Johnson",
        facultySlot: ["C1", "C2"],
        _id: "3",
      },
    ],
  ];
  return (
    <div className="">
      <TimeTableFacultyShowcase initialFacultyData={initialFacultyData[0]} ></TimeTableFacultyShowcase>
    </div>
  );
}
