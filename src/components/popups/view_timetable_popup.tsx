import Image from "next/image";
import React from "react";
import Timetable from "@/components/timetable/TimeTable";
import FacultyTable from "@/components/FacultyTable";
import { facultyData, tableFacingSlot } from "@/lib/type";
import useScreenSize from "@/hooks/useScreenSize"; // Adjust import path if different

interface ViewTimetableProps {
  onClose: () => void;
}

const savedTimetable = {
  name: "Morning Theory TT",
  facultyData: [
    {
      faculty: "SRIDHAR RAJ S",
      facultySlot: ["L11+L12+L27+L28"],
      subject: "SJT621 - java",
      _id: "0",
    },
    {
      faculty: "DIVYA LAKSHMI K",
      facultySlot: ["L13+L14+L23+L24"],
      subject: "SJT418 - java",
      _id: "1",
    },
  ],
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
const buttons = [

 
  { label: 'Share', bg: '#C1FF83', icon: '/Send.svg' },
  { label: 'Download', bg: '#FFEA79', icon: '/download.svg' },
];
const SharePopup: React.FC<ViewTimetableProps> = ({ onClose }) => {
  const screenSize = useScreenSize();
  const slotNames = extractSlotNames(savedTimetable.facultyData);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 backdrop-blur-sm z-50 px-4 sm:px-12 h-full">
      <div className="w-full max-w-6xl bg-[#e2f2f9] rounded-3xl shadow-[7px_7px_7px_rgba(0,0,0,1.00)] outline-4 outline-offset-[-2px] outline-black min-h-[60vh] flex flex-col h-[80vh]">
        <div className="flex justify-between items-center h-14 bg-[#8bd5ff] rounded-t-3xl outline-4 outline-offset-[-2px] outline-black px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
          </div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl font-semibold font-['Poppins'] text-center flex-1">
            {savedTimetable.name}
          </span>
          <button
            onClick={onClose}
            className="w-13 h-14 flex items-center justify-center bg-red-300 rounded-tr-3xl outline-4 outline-offset-[-2px] outline-black text-xl font-bold relative left-4"
          >
            <Image
              src="/x.svg"
              alt="x"
              width={120}
              height={80}
              className="flex justify-center w-8 h-8"
            />
          </button>
        </div>

        <div
          className={`p-6 sm:p-8 flex gap-6 flex-1 ${
            screenSize === "mobile" ? "flex-col" : "flex-row"
          }`}
        >
          <div className="overflow-auto basis-2/3 h-full flex-1">
            <Timetable slotNames={slotNames} />
          </div>
          <div className="overflow-auto basis-1/3 h-full flex-1">
            <FacultyTable list={savedTimetable.facultyData} />
          </div>
        </div>
        <div className="flex gap-9 w-full justify-center items-center">
              {buttons.map((btn, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: btn.bg }}
                  className="flex items-center gap-2 px-6 py-2 border-2 border-black rounded-lg shadow-[3px_3px_0_0_black] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  <span className="text-lg font-medium">{btn.label}</span>
                  <Image src={btn.icon} alt={btn.label} className="w-4 h-4" width={120} height={80} />
                </button>
              ))}
            </div>
         

        <div className="h-6" />
      </div>
    </div>
  );
};

export default SharePopup;
