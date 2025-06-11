"use client";

import React, { useState } from "react";
import TimeTable from "@/components/timetable/TimeTable";
import FacultyTable from "@/components/ui/FacultyTable";
import TimetableSwitcher from "@/components/timetable/components/TimeTableSwitcher";
import { facultyData, tableFacingSlot } from "@/lib/type";
import ActionButtons from "@/components/timetable/components/ActionButtons";
import ReplaceSlot from "@/components/timetable/components/QuickModify";
import Header from "@/components/ui/Header";
import FacultySelector from "@/components/ui/FacultySelector";
import CourseCard from "@/components/ui/CourseCard";
import Image from "next/image";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

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
    <div className="w-screen bg-[#CEE4E5] font-poppins flex items-center justify-center flex-col">

      <Header />

      <Navbar page="landing" loggedin={false} />

      <div className="relative w-full flex justify-center">
        <Image
          src="/e.svg"
          alt="E"
          width={32}
          height={32}
          className="absolute left-[4%] top-16 sm:top-16 z-10 lg:w-11 select-none"
        />
        <Image
          src="/f.svg"
          alt="F"
          width={32}
          height={32}
          className="absolute right-[8%] top-60 sm:top-60 z-10 lg:w-11 select-none"
        />
        <Image
          src="/c.svg"
          alt="C"
          width={32}
          height={32}
          className="absolute bottom-36 left-[10%] z-10 lg:w-11 select-none"
        />

        <FacultySelector
          domains={[]}
          subjects={[]}
          slots={[]}
          faculties={["a", "b", "c"]}
          onConfirm={() => { }}
          onReset={() => { }}
        />
      </div>

      <CourseCard />

      <div className="flex flex-col h-full max-w-[1600px] mx-auto min-w-[1000px] px-6 py-4 overflow-hidden bg-[#A7D5D7]">
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
      <div className="w-[80%] my-16">
        <Image
          src="/footer.svg"
          alt="footer wave"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full"
          priority
        />
      </div>
      <Footer />
    </div>
  );
}
