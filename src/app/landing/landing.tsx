"use client";

import React, { useState } from "react";
import TimeTable from "@/components/timetable/TimeTable";
import FacultyTable from "@/components/ui/FacultyTable";
import TimetableSwitcher from "@/components/timetable/components/TimeTableSwitcher";
import { IFacultyData, tableFacingSlot } from "@/lib/type";
import FacultySelector from "@/components/ui/FacultySelector";

const extractSlotNames = (facultyData: IFacultyData[]): tableFacingSlot[] => {
  const slotSet = new Set<string>();
  facultyData.forEach((faculty) => {
    faculty.facultySlot.forEach((group) => {
      group.split("+").forEach((slotName) => {
        slotSet.add(slotName);
      });
    });
  });
  return Array.from(slotSet).map((slotName) => ({ slotName, showName: true }));
};

const initialFacultyData: IFacultyData[][] = [
  [
    {
      _id: "1",
      faculty: "DHIVYAA C R",
      facultySlot: ["G1"],
      subject: "BCSE102P",
    },
    {
      _id: "2",
      faculty: "DHIVYAA C R",
      facultySlot: ["L43+L44+L53+L54"],
      subject: "BENG101L",
    },
    {
      _id: "3",
      faculty: "SOUMEN MUKHERJEE",
      facultySlot: ["B1"],
      subject: "BENG101P",
    },
    {
      _id: "4",
      faculty: "SOUMEN MUKHERJEE",
      facultySlot: ["L45+L46"],
      subject: "BHUM101N",
    },
    {
      _id: "5",
      faculty: "BHUVANESWARI M",
      facultySlot: ["NIL"],
      subject: "BHUM220L",
    },
    {
      _id: "6",
      faculty: "SAVITHA N",
      facultySlot: ["C1+TC1"],
      subject: "BMAT101L",
    },
    {
      _id: "7",
      faculty: "ARUN KUMAR BADAJENA",
      facultySlot: ["D1+TD1"],
      subject: "BMAT101P",
    },
    {
      _id: "8",
      faculty: "ARUN KUMAR BADAJENA",
      facultySlot: ["L35+L36"],
      subject: "BPHY101L",
    },
    {
      _id: "9",
      faculty: "KANHAIYA LAL PANDEY",
      facultySlot: ["E1+TE1"],
      subject: "BPHY101P",
    },
    {
      _id: "10",
      faculty: "KANHAIYA LAL PANDEY",
      facultySlot: ["L47+L48"],
      subject: "BSTS101P",
    },
    {
      _id: "11",
      faculty: "SIXPHRASE (APT)",
      facultySlot: ["F1+TF1"],
      subject: "BSTS101P",
    },
  ],
  [
    { faculty: "John Doe", facultySlot: ["A1+TA1+TAA1"], _id: "1" },
    { faculty: "Jane Smith", facultySlot: ["B2", "L1+L2"], _id: "2" },
    { faculty: "f3", facultySlot: ["A2"], _id: "3" },
    { faculty: "f4", facultySlot: ["B1"], _id: "4" },
    { faculty: "f5", facultySlot: ["D1+TD1", "E1+TE1"], _id: "5" },
  ],
  [
    { faculty: "Alice Johnson", facultySlot: ["C1", "C2"], _id: "6" },
    { faculty: "Tom Hardy", facultySlot: ["L1+L2", "A2"], _id: "7" },
    { faculty: "Priya Kumar", facultySlot: ["B1", "C2"], _id: "8" },
  ],
];

export default function View() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleStart, setVisibleStart] = useState(0);
  const maxVisible = 4;
  const total = initialFacultyData.length;
  const selectedData = initialFacultyData[selectedIndex];
  const slotNames: tableFacingSlot[] = extractSlotNames(selectedData);
  const timetableCount = initialFacultyData.length;

  const handleLeft = () => {
    if (visibleStart > 0) setVisibleStart(visibleStart - 1);
  };

  const handleRight = () => {
    if (visibleStart + maxVisible < total) setVisibleStart(visibleStart + 1);
  };

  const visibleIndexes = Array.from(
    { length: maxVisible },
    (_, i) => visibleStart + i
  ).filter((i) => i < total);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#a7d5d7] font-poppins">
      <div className="flex flex-col h-full max-w-[1600px] mx-auto min-w-[1000px] px-6 py-4 box-border">
        <div className="flex items-center mb-4 ml-2">
          <h1
            className="text-[3vw] font-pangolin leading-tight text-left"
            style={{ fontFamily: 'Pangolin, cursive' }}
          >
            Your Timetables
          </h1>
          <span
            className=" text-[1.5vw] ml-7 text-base font-normal"
          //style={{ fontFamily: 'Pangolin, cursive', color: 'black' }} checkout this 
          >
            ({timetableCount} timetables were generated)
          </span>
        </div>

        <div className="flex flex-1 gap-6 overflow-hidden">
          <div className="flex-[2] overflow-auto p-2">
            <div className="bg-white border-2 border-black rounded-xl p-4 h-full">
              <TimeTable slotNames={slotNames} />
            </div>
          </div>
          <div className="flex-1 overflow-auto rounded p-2">
            <FacultyTable list={selectedData} />
          </div>
        </div>


        <div className="flex justify-between items-left ml-8  mt-1">
          <div className="mt-2 text-left">
            <TimetableSwitcher
              visibleStart={visibleStart}
              maxVisible={maxVisible}
              total={total}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onLeft={handleLeft}
              onRight={handleRight}
            />
          </div>
        </div>

        <footer className="mt-6 border-t border-black pt-8 pb-8">
          <div className="flex flex-wrap gap-4">
            <h1 className="text-xl font-semibold">REPLACEMENT COMPONENT</h1>
          </div>
        </footer>
      </div>
    </div>
  );
}
