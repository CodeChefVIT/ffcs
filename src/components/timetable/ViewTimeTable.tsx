"use client";

import React, { useState } from "react";
import { useTimetable } from "@/components/timetable/TimeTableContext";

import { facultyData, tableFacingSlot } from "@/lib/type";
import TimeTable from "@/components/timetable/TimeTable";
import FacultyTable from "@/components/FacultyTable";
import TimetableSwitcher from "@/components/timetable/TimeTableSwitcher";
import ActionButtons from "@/components/timetable/ActionButtons";

const transformAPIResponseToFacultyData = (
  response: any
): facultyData[][] => {
  if (!response?.result) return [[]]; // Return empty array structure if no data

  return response.result.map((timetable: any, ttIndex: number) =>
    timetable.map((facultyObj: any, index: number) => ({
      _id: `${ttIndex}-${index}`,
      faculty: facultyObj.faculty,
      facultySlot: [
        facultyObj.facultySlot.length > 0
          ? facultyObj.facultySlot.join("+")
          : "NIL",
      ],
      subject: response.courseNames?.[ttIndex] || "Unknown",
    }))
  );
};

const extractSlotNames = (facultyData: facultyData[]): tableFacingSlot[] => {
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

export default function ViewTimeTable() {
  const { timetableData } = useTimetable();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Always transform timetableData; fallback to empty timetable if none exists
  const initialFacultyData = timetableData
    ? transformAPIResponseToFacultyData(timetableData)
    : [[]];

  const total = initialFacultyData.length;
  const selectedData = initialFacultyData[selectedIndex] || [];
  const slotNames: tableFacingSlot[] = extractSlotNames(selectedData);
  const timetableCount = total;

  const handleLeft = () => {
    if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const handleRight = () => {
    if (selectedIndex < total - 1) setSelectedIndex(selectedIndex + 1);
  };

  return (
    <div className="w-screen lg:h-screen bg-[#CEE4E5] font-poppins flex items-center justify-center flex-col px-2 sm:px-6 py-4">
      <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-4 overflow-hidden bg-[#A7D5D7]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 ml-2">
          <h1 className="text-[6vw] sm:text-[4vw] md:text-[3vw] font-pangolin leading-tight text-left">
            Your Timetables
          </h1>
          <span className="text-[3vw] sm:text-[2vw] md:text-[1.5vw] ml-4 sm:ml-7 font-normal font-poppins">
            ({timetableCount} timetables were generated)
          </span>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 gap-6 overflow-hidden">
          <div className="flex-[2.5] overflow-auto p-2 max-h-[70vh]">
            <TimeTable slotNames={slotNames} />
          </div>

          <div className="flex-1 overflow-auto rounded p-2 max-h-[70vh]">
            <FacultyTable list={selectedData} />
          </div>
        </div>

        <div className="mt-1 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 gap-4 min-h-[64px]">
          <div className="sm:mr-auto w-full sm:w-auto">
            <TimetableSwitcher
              visibleStart={0}
              maxVisible={4}
              total={total}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onLeft={handleLeft}
              onRight={handleRight}
            />
          </div>
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
