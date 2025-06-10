"use client";

import React, { useState } from "react";
import TimeTable from "@/components/timetable/TimeTable";
import FacultyTable from "@/components/ui/FacultyTable";
import TimetableSwitcher from "@/components/timetable/components/TimeTableSwitcher";
import { facultyData, tableFacingSlot } from "@/lib/type";
import ActionButtons from "@/components/timetable/components/ActionButtons";
import ReplaceSlot from "@/components/timetable/components/QuickModify";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

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

export default function View() {
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
    <div className="w-screen overflow-hidden bg-[#a7d5d7] font-poppins">
      <Header />
      <div className="flex flex-col h-full max-w-[1600px] mx-auto min-w-[1000px] px-6 py-4 box-border">
        <div className="flex items-center mb-4 ml-2">
          <h1
            className="text-[3vw] font-pangolin leading-tight text-left"
            style={{ fontFamily: "Pangolin, cursive" }}
          >
            Your Timetables
          </h1>
          <span className="text-[1.5vw] ml-7 text-base font-normal">
            ({timetableCount} timetables were generated)
          </span>
        </div>

        <div className="flex flex-1 gap-6 overflow-hidden">
          <div className="flex-[2] overflow-auto p-2">
            <TimeTable slotNames={slotNames} />
          </div>
          <div className="flex-1 overflow-auto rounded p-2">
            <FacultyTable list={selectedData} />
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between px-8" style={{ height: 64 }}>
          <div className="flex items-center">
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

          <div className="flex items-center">
            <ActionButtons />
          </div>
        </div>

        <footer className="mt-4 border-t-3 border-black pt-2 pb-2">
          <ReplaceSlot />
        </footer>
      </div>
    </div>
  );
}
