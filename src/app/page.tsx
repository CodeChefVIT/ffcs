import TimeTableFacultyShowcase from "../components/timetable/TimeTableFacultyShowcase";

export default function Home() {
  const initialFacultyData = [
    [
      {
        faculty: "John Doe",
        facultySlot: ["A1+TA1+TAA1"],
        _id: "1",
      },
      {
        faculty: "Jane Smith",
        facultySlot: ["B2", "L1+L2"],
        _id: "2",
      },
      {
        faculty: "f3",
        facultySlot: ["A2"],
        _id: "3",
      },
      {
        faculty: "f4",
        facultySlot: ["B1",],
        _id: "4",
      },
      {
        faculty: "f5",
        facultySlot: ["D1+TD1", "E1+TE1"],
        _id: "5",
      },
    ],
    [
      {
        faculty: "Alice Johnson",
        facultySlot: ["C1", "C2"],
        _id: "6",
      },
    ],
  ];
  return (
    <div className="">
      <TimeTableFacultyShowcase initialFacultyData={initialFacultyData[0]} ></TimeTableFacultyShowcase>
    </div>
  );
}
