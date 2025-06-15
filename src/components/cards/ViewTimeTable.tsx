"use client";

import React, { useState } from "react";
import axios from "axios";

import CompoundTable from "@/components//ui/CompoundTable";
import { ZButton } from "@/components/ui/Buttons";
import { useTimetable } from "@/lib/TimeTableContext";
import Image from "next/image";

const DUMMY_USER_ID = "665f1e8e2f8b9b0012345678";

function getVisibleIndexes(selected: number, total: number) {
  const maxVisible = 5;
  const shift = 2;
  const start = Math.max(1, Math.min(selected - shift, total - maxVisible + 1));
  const end = Math.min(total, start + maxVisible - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function ViewTimeTable() {
  const { timetableData } = useTimetable();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const timetableNumber = selectedIndex + 1;
  const allTimatables = timetableData ? timetableData : [[]];
  const timetableCount = allTimatables.length;
  const selectedData = allTimatables[selectedIndex] || [];
  const visibleIndexes = getVisibleIndexes(timetableNumber, timetableCount);

  // console.log("Timetable Data:", timetableData);
  // console.log("Selected Data:", selectedData);

  const convertedData = selectedData.map((item) => ({
    code: item.courseCode || "00000000",
    slot: item.slotName || "NIL",
    name: item.facultyName || "Unknown",
  }));

  async function handleSave() {
    if (!selectedData || selectedData.length === 0) return;

    const slots = selectedData.map((item: any) => ({
      slot: item.slotName || "NIL",
      courseCode: item.courseCode || "00000000",
      courseName: item.courseName || "Unknown",
      facultyName: item.facultyName || "Unknown",
    }));

    try {
      const res = await axios.post("/api/save-timetable", {
        title: `Saved Timetable ${selectedIndex + 1}`,
        slots,
        owner: DUMMY_USER_ID,
      });
      console.log("selectedData:", selectedData);
console.log("slots to save:", slots);
      if (res.data.success) {
        alert("Timetable saved!");
      } else {
        alert("Failed to save timetable.");
      }
    } catch (e) {
      alert("Error saving timetable.");
    }
  }

  const actionButtons = [
    { label: 'Email', color: 'yellow', icon: '/icons/mail.svg', onClick: () => console.log("Email clicked") },
    { label: 'Save', color: 'green', icon: '/icons/save.svg', onClick: handleSave },
    { label: 'Report', color: 'purple', icon: '/icons/report.svg', onClick: () => console.log("Report clicked") },
    { label: 'Share', color: 'green', icon: '/icons/send.svg', onClick: () => console.log("Share clicked") },
    { label: 'Download', color: 'yellow', icon: '/icons/download.svg', onClick: () => console.log("Download clicked") },
  ];

  return (
    <div
      id="timetable-view"
      className="w-screen mt-12 bg-[#A7D5D7] font-poppins flex items-center justify-center flex-col border-black border-3"
    >
      <div className="flex flex-col h-full p-12 overflow-hidden">

        <div className="flex flex-row items-end mb-4 ml-2">
          <div className="text-5xl font-pangolin">
            Your Timetables
          </div>
          <div className="text-xl ml-8 font-poppins pb-1">
            ({timetableCount} timetable{timetableCount != 1 ? "s were" : " was"} generated)
          </div>
        </div>

        <div className="w-full max-w-[95vw] my-4">
          <CompoundTable data={convertedData} large={true} />
        </div>

        <div className="flex flex-row items-center justify-between px-8 pt-8 gap-8">

          <div className="w-auto">

            <div className=" w-full flex justify-center">

              <button
                onClick={timetableNumber === 1 ? undefined : () => setSelectedIndex(0)}
                disabled={timetableNumber === 1}
                className={`
                  ${timetableNumber === 1 ? 'bg-[#6CC0C5]' : 'bg-[#75E5EA]'}
                  font-poppins
                  border-2 border-black
                  font-semibold
                  flex items-center justify-center text-center
                  transition duration-100
                  h-12 w-12
                  rounded-l-xl
                  shadow-[4px_4px_0_0_black]
                  ${timetableNumber === 1 ? 'cursor-normal' : 'cursor-pointer'}
                  ${timetableNumber === 1 ? 'cursor-normal' : 'cursor-pointer'}
                  ${timetableNumber === 1 ? '' : 'active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]'}
                `}
              >
                <span style={{ pointerEvents: 'none', display: 'flex' }}>
                  <Image src="/icons/start.svg" alt="" width={32} height={32} />
                </span>
              </button>

              <div className="flex flex-row">
                {visibleIndexes.map((index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index - 1)}
                    className={`
                      ${timetableNumber === index ? 'bg-[#6CC0C5]' : 'bg-[#75E5EA]'}
                      font-poppins
                      border-2 border-black
                      font-bold
                      text-lg
                      flex items-center justify-center text-center
                      transition duration-100
                      h-12 w-12
                      shadow-[4px_4px_0_0_black]
                      ${timetableNumber === index ? 'cursor-normal' : 'cursor-pointer'}
                      ${timetableNumber === index ? '' : 'active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]'}
                    `}
                  >
                    {index}
                  </button>
                ))}
              </div>

              <button
                onClick={timetableNumber === timetableCount ? undefined : () => setSelectedIndex(timetableCount - 1)}
                disabled={timetableNumber === timetableCount}
                className={`
                  ${timetableNumber === timetableCount ? 'bg-[#6CC0C5]' : 'bg-[#75E5EA]'}
                  font-poppins
                  border-2 border-black
                  font-semibold
                  flex items-center justify-center text-center
                  transition duration-100
                  h-12 w-12
                  rounded-r-xl
                  shadow-[4px_4px_0_0_black]
                  ${timetableNumber === timetableCount ? 'cursor-normal' : 'cursor-pointer'}
                  ${timetableNumber === timetableCount ? 'cursor-normal' : 'cursor-pointer'}
                  ${timetableNumber === timetableCount ? '' : 'active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]'}
                `}
              >
                <span style={{ pointerEvents: 'none', display: 'flex' }}>
                  <Image src="/icons/end.svg" alt="" width={32} height={32} />
                </span>
              </button>

            </div>

          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {actionButtons.map((btn, idx) => (
              <div key={idx}>
                <ZButton
                  type="regular"
                  text={btn.label}
                  image={btn.icon}
                  color={btn.color || "blue"}
                  onClick={btn.onClick}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
