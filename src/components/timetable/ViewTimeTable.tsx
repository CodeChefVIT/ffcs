"use client";

import React, { useState } from "react";
import { facultyData, tableFacingSlot } from "@/lib/type";

import TimeTable from "@/components/timetable/TimeTable";
import FacultyTable from "@/components/FacultyTable";
import TimetableSwitcher from "@/components/timetable/TimeTableSwitcher";
import ActionButtons from "@/components/timetable/ActionButtons";
import ReplaceSlot from "@/components/timetable/QuickModify";

type APIFaculty = {
  faculty: string;
  facultySlot: string[];
};

type APIResponse = {
  message: string;
  result: APIFaculty[][];
  courseNames: string[];
};

const apiResponse: APIResponse = {
  message: "success",
  result: [
    [
      {
        faculty: "SRIDHAR RAJ S",
        facultySlot: ["L11", "L12", "L27", "L28"],
      },
      {
        faculty: "DIVYA LAKSHMI K",
        facultySlot: ["L13", "L14", "L23", "L24"],
      },
    ],
    [
      {
        faculty: "SRIDHAR RAJ S",
        facultySlot: ["L11", "L12", "L27", "L28"],
      },
      {
        faculty: "SREETHAR S",
        facultySlot: ["L13", "L14", "L23", "L24"],
      },
    ],
  ],
  courseNames: ["SJT621 - java", "SJT418/SJT419 - java"],
};

const transformAPIResponseToFacultyData = (
  response: APIResponse
): facultyData[][] => {
  return response.result.map((timetable, ttIndex) =>
    timetable.map((facultyObj, index) => ({
      _id: `${ttIndex}-${index}`,
      faculty: facultyObj.faculty,
      facultySlot: [
        facultyObj.facultySlot.length > 0
          ? facultyObj.facultySlot.join("+")
          : "NIL",
      ],
      subject: response.courseNames[ttIndex] || "Unknown",
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
  const initialFacultyData = transformAPIResponseToFacultyData(apiResponse);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const visibleStart = useState(0)[0];
  const maxVisible = 4;
  const total = initialFacultyData.length;
  const selectedData = initialFacultyData[selectedIndex];
  const slotNames: tableFacingSlot[] = extractSlotNames(selectedData);
  const timetableCount = initialFacultyData.length;

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
  <h1
    className="text-[6vw] sm:text-[4vw] md:text-[3vw] font-pangolin leading-tight text-left"
  >
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
            visibleStart={visibleStart}
            maxVisible={maxVisible}
            total={total}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            onLeft={handleLeft}
            onRight={handleRight}
          />
        </div>
        <ActionButtons />
      </div>

        
        <footer className="mt-4 border-t-2 border-black pt-2 pb-2">
          <ReplaceSlot />
        </footer>
      </div>
    </div>
  );
}
