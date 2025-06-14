"use client";

import React, { useState } from "react";
import { facultyData } from "@/lib/type";

import CompoundTable from "@/components//ui/CompoundTable";
import { ZButton } from "@/components/ui/Buttons";
import { useTimetable } from "@/components/timetable/TimeTableContext";

const actionButtons = [
  { label: 'Email', color: 'yellow', icon: '/icons/mail.svg', onClick: () => console.log("Email clicked") },
  { label: 'Save', color: 'green', icon: '/icons/save.svg', onClick: () => console.log("Save clicked") },
  { label: 'Report', color: 'purple', icon: '/icons/report.svg', onClick: () => console.log("Report clicked") },
  { label: 'Share', color: 'green', icon: '/icons/send.svg', onClick: () => console.log("Share clicked") },
  { label: 'Download', color: 'yellow', icon: '/icons/download.svg', onClick: () => console.log("Download clicked") },
];

const transformAPIResponseToFacultyData = (response: any): facultyData[][] => {
  if (!response?.result) return [[]]; // Return empty array structure if no data
  return response.result.map((timetable: any, ttIndex: number) =>
    timetable.map((facultyObj: any, index: number) => ({
      _id: `${ttIndex}-${index}`,
      faculty: facultyObj.faculty,
      facultySlot: [facultyObj.facultySlot.length > 0 ? facultyObj.facultySlot.join("+") : "NIL",],
      subject: response.courseNames?.[ttIndex] || "Unknown",
    }))
  );
};

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
  const allTimatables = timetableData ? transformAPIResponseToFacultyData(timetableData) : [[]];
  const timetableCount = allTimatables.length;
  const selectedData = allTimatables[selectedIndex] || [];
  const visibleIndexes = getVisibleIndexes(selectedIndex, timetableCount);

  // console.log("Timetable Data:", timetableData);
  // console.log("Selected Data:", selectedData);

  const convertedData = selectedData.map((item) => ({
    code: item.subject || "00000000",
    slot: item.facultySlot.join("+"),
    name: item.faculty || "Unknown",
  }));


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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 48,
                  background: '#75E5EA',
                  borderRadius: 12,
                  border: '2px solid black',
                  boxShadow: '3px 3px 0px black',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setSelectedIndex(0)}
                  disabled={selectedIndex === 0}
                  style={{
                    width: 48,
                    height: 48,
                    background: '#75E5EA',

                    fontSize: 20,
                    fontWeight: 700,
                    cursor: selectedIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: selectedIndex === 0 ? 0.4 : 1,
                    border: 'none',
                    borderRight: '2px solid black',
                  }}
                >
                  ‹
                </button>

                {visibleIndexes.map((i, idx) => (
                  <div
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    style={{
                      width: 40,
                      height: 48,
                      background:
                        selectedIndex === i ? 'rgba(255,255,255,0.4)' : '#75E5EA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 700,
                      fontFamily: 'Poppins',
                      cursor: 'pointer',
                      borderRight: '2px solid black',
                      borderLeft: idx === 0 ? '2px solid black' : 'none',
                    }}
                  >
                    {i + 1}
                  </div>
                ))}

                <button
                  onClick={() => setSelectedIndex(timetableCount - 1)}
                  disabled={selectedIndex + 5 >= timetableCount}
                  style={{
                    width: 48,
                    height: 48,
                    background: '#75E5EA',
                    fontSize: 20,
                    fontWeight: 700,
                    cursor:
                      selectedIndex + 5 >= timetableCount ? 'not-allowed' : 'pointer',
                    opacity: selectedIndex + 5 >= timetableCount ? 0.4 : 1,
                    border: 'none',
                    borderLeft: '2px solid black',
                  }}
                >
                  ›
                </button>
              </div>
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
