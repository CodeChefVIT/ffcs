"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

import CompoundTable from "@/components//ui/CompoundTable";
import { ZButton } from "@/components/ui/Buttons";
import { useTimetable } from "@/lib/TimeTableContext";
import Image from "next/image";
import Popup from "@/components/ui/Popup"; 
import AlertModal from "@/components/ui/AlertModal";

export default function ViewTimeTable() {
  const { timetableData } = useTimetable();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [saveTTName, setSaveTTName] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [sharePublic, setSharePublic] = useState(true); // for share toggle
  const [shareId, setShareId] = useState<string>("");

  const { data: session } = useSession();
  const owner = session?.user?.email || null;
  // console.log("Session Data:", owner);

  const timetableNumber = selectedIndex + 1;
  const allTimatables = timetableData ? timetableData : [[]];
  const timetableCount = allTimatables.length;
  const selectedData = allTimatables[selectedIndex] || [];
  const visibleIndexes = getVisibleIndexes(timetableNumber, timetableCount);
  console.log;

  // console.log("Timetable Data:", timetableData);
  // console.log("Selected Data:", selectedData);

  const convertedData = selectedData.map((item) => ({
    code: item.courseCode || "00000000",
    slot: item.slotName || "NIL",
    name: item.facultyName || "Unknown",
  }));

  async function handleSave(ttName?: string) {
    if (!selectedData || selectedData.length === 0) return;

    const slots = selectedData.map((item: any) => ({
      slot: item.slotName || "NIL",
      courseCode: item.courseCode || "00000000",
      courseName: item.courseName || "Unknown",
      facultyName: item.facultyName || "Unknown",
    }));

    try {
      const res = await axios.post("/api/save-timetable", {
        title: ttName || `Saved Timetable`,
        slots,
        owner: owner,
      });
      console.log("Save response:", res.data);

      console.log("selectedData:", selectedData);
      //console.log("slots to save:", slots);
      if (res.data.success) {
        showAlert("Timetable saved!");
      } else {
        showAlert("Failed to save timetable.");
      }
    } catch (e) {
      showAlert("Error saving timetable.");
    }
  }

  async function handleShare() {
    if (!selectedData || selectedData.length === 0) {
      showAlert("No timetable to share.");
      return;
    }

    // Save the timetable as public/private based on toggle
    try {
      const slots = selectedData.map((item: any) => ({
        slot: item.slotName || "NIL",
        courseCode: item.courseCode || "00000000",
        courseName: item.courseName || "Unknown",
        facultyName: item.facultyName || "Unknown",
      }));

      const res = await axios.post("/api/save-timetable", {
        title: saveTTName || `Shared Timetable`,
        slots,
        owner: owner,
        isPublic: sharePublic,
      });

      if (res.data && res.data.timetable && res.data.timetable.shareId) {
        const newShareId = res.data.timetable.shareId;
        setShareId(newShareId);
        setShareLink(`${window.location.origin}/share/${newShareId}`);
        setShowSharePopup(true);
      } else {
        showAlert("Failed to generate share link.");
      }
    } catch (e) {
      showAlert("Error sharing timetable.");
    }
  }

  function withLoginCheck(action: () => void, skipCheck = false) {
    return () => {
      if (!owner && !skipCheck) {
        setShowLoginPopup(true);
        return;
      }
      action();
    };
  }

  function handleShareToggle(state: "on" | "off") {
    setSharePublic(state === "on");
  }

  const actionButtons = [
    {
      label: "Email",
      color: "yellow",
      icon: "/icons/mail.svg",
      onClick: withLoginCheck(() => console.log("Email clicked")),
    },
    {
      label: "Save",
      color: "green",
      icon: "/icons/save.svg",
      onClick: withLoginCheck(() => {
        setSaveTTName("");
        setShowSavePopup(true);
      }),
    },
    {
      label: "Report",
      color: "purple",
      icon: "/icons/report.svg",
      onClick: withLoginCheck(() => console.log("Report clicked")),
    },
    {
      label: "Share",
      color: "green",
      icon: "/icons/send.svg",
      onClick: withLoginCheck(handleShare),
    },
    {
      label: "Download",
      color: "yellow",
      icon: "/icons/download.svg",
      onClick: withLoginCheck(() => console.log("Download clicked"), true),
    },
  ];

  function showAlert(msg: string) {
    setAlertMsg(msg);
    setAlertOpen(true);
  }

  return (
    <div
      id="timetable-view"
      className="w-screen mt-12 bg-[#A7D5D7] font-poppins flex items-center justify-center flex-col border-black border-3"
    >
      <div className="flex flex-col h-full p-12 overflow-hidden">
        <div className="flex flex-row items-end mb-4 ml-2">
          <div className="text-5xl font-pangolin">Your Timetables</div>
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

      {showSharePopup && (
        <Popup
          type="share_tt"
          dataBody={shareLink}
          closeLink={() => setShowSharePopup(false)}
          shareEnabledDefault={sharePublic}
          shareSwitchAction={handleShareToggle}
        />
      )}

      {showLoginPopup && (
        <Popup
          type="login"
          closeLink={() => setShowLoginPopup(false)}
        />
      )}

      {showSavePopup && (
        <Popup
          type="save_tt"
          dataBody={saveTTName}
          closeLink={() => setShowSavePopup(false)}
          action={() => {
            if (!saveTTName.trim()) {
              alert("Please enter a timetable name.");
              return;
            }
            setShowSavePopup(false);
            handleSave(saveTTName.trim());
          }}
          onInputChange={setSaveTTName}
        />
      )}

      <AlertModal
        open={alertOpen}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}

function getVisibleIndexes(selected: number, total: number) {
  const maxVisible = 5;
  const shift = 2;
  const start = Math.max(1, Math.min(selected - shift, total - maxVisible + 1));
  const end = Math.min(total, start + maxVisible - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
