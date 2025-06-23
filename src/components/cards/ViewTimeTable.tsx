"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

import CompoundTable from "@/components//ui/CompoundTable";
import { ZButton } from "@/components/ui/Buttons";
import { useTimetable } from "@/lib/TimeTableContext";
import Image from "next/image";
import Popup from "@/components/ui/Popup";
import AlertModal from "@/components/ui/AlertModal";
import LoadingPopup from "@/components/ui/LoadingPopup";
import { getCurrentDateTime } from "@/lib/utils";
import { generateShareId } from "@/lib/shareIDgenerate";
import { exportToPDF } from "@/lib/exportToPDF";
import ComboBox from "../ui/ComboBox";

export default function ViewTimeTable() {
  const { timetableData } = useTimetable();
  const originalTimetableData = timetableData ? timetableData : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [saveTTName, setSaveTTName] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [sharePublic, setSharePublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [filterFaculty, setFilterFaculty] = useState("");

  const { data: session } = useSession();
  const owner = session?.user?.email || null;

  const timetableNumber = selectedIndex + 1;
  var allTimetables = timetableData ? timetableData : [];
  const timetableCount = allTimetables.length;
  const selectedData = allTimetables[selectedIndex] || [];
  const visibleIndexes = getVisibleIndexes(timetableNumber, timetableCount);

  const facultyList = Array.from(
    new Set(
      originalTimetableData
        .flat()
        .map((item: { facultyName?: string }) => item.facultyName || "Unknown")
    )
  ).sort((a, b) => a.localeCompare(b));


  const convertedData = selectedData.map(
    (item: {
      courseCode?: string;
      slotName?: string;
      facultyName?: string;
    }) => ({
      code: item.courseCode || "00000000",
      slot: item.slotName || "NIL",
      name: item.facultyName || "Unknown",
    })
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [timetableData]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filterFaculty]);

  useEffect(() => {
    if (!timetableData || timetableData.length === 0) return;

    timetableData.forEach((timetable, index) => {
      if (!(timetable as any).shareId) {
        (timetable as any).shareId = generateShareId();
      }
    });
  }, [timetableData]);

  function getSavedTimetables(key: string) {
    if (typeof window === 'undefined') return [];
    try {
      const str = localStorage.getItem(key);
      return str ? JSON.parse(str) : [];
    } catch {
      return [];
    }
  }

  function saveTimetableToLocal(key: string, record: any) {
    if (typeof window === 'undefined') return;
    try {
      const arr = getSavedTimetables(key);
      arr.push(record);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch {

    }
  }

  function getSavedCourses() {
    if (typeof window === 'undefined') return [];
    try {
      const str = localStorage.getItem('savedCourses');
      return str ? JSON.parse(str) : [];
    } catch {
      return [];
    }
  }

  function saveCourseToLocal(course: { courseCode: string; courseName: string }) {
    if (typeof window === 'undefined') return;
    try {
      const arr = getSavedCourses();
      const exists = arr.some((c: any) => c.courseCode === course.courseCode);
      if (!exists) {
        arr.push(course);
        localStorage.setItem('savedCourses', JSON.stringify(arr));
      }
    } catch {
      // ignore
    }
  }

  function slotsMatch(a: any[], b: any[]) {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }
  async function handleSave(ttName?: string) {
    if (!selectedData || selectedData.length === 0) {
      showAlert("No timetable to save.");
      return;
    }

    const slots = selectedData.map((item: {
      slotName?: string;
      courseCode?: string;
      courseName?: string;
      facultyName?: string;
    }) => ({
      slot: item.slotName || "NIL",
      courseCode: item.courseCode || "00000000",
      courseName: item.courseName || "Unknown",
      facultyName: item.facultyName || "Unknown",
    }));

    const savedKey = 'savedTimetables';
    const savedList = getSavedTimetables(savedKey);

    for (const rec of savedList) {
      if (slotsMatch(rec.slots, slots)) {
        const existingId = rec.shareId || 'N/A';

        axios.get(`/api/shared-timetable/${existingId}`)
          .then((res) => {
            const json = res.data;
            const title = json?.timetable?.title || "Backend se nahi aya bc";
            showAlert(`You have already saved this timetable Named (${title}) with ShareID: ${existingId} `);
          })
          .catch(() => {
            showAlert(`You have already saved this timetable with ID: ${existingId}`);
          });
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await axios.post("/api/save-timetable", {
        title: ttName || `Saved Timetable`,
        slots,
        owner: owner,
      });

      if (res.data.success) {
        const returnedId = res.data.timetable?.shareId;
        if (returnedId) {
          saveTimetableToLocal(savedKey, { slots, shareId: returnedId });

          slots.forEach(s => {
            saveCourseToLocal({
              courseCode: s.courseCode,
              courseName: s.courseName,
            });
          });

          showAlert("Timetable saved!");
        } else {
          showAlert("Failed to save timetable.");
        }
      } else {
        showAlert("Failed to save timetable.");
      }
    } catch {
      showAlert("Error saving timetable.");
    } finally {
      setIsSaving(false);
    }
  }


  async function handleShare() {
    if (!selectedData || selectedData.length === 0) {
      showAlert("No timetable to share.");
      return;
    }

    const slots = selectedData.map((item) => ({
      slot: item.slotName || "NIL",
      courseCode: item.courseCode || "00000000",
      courseName: item.courseName || "Unknown",
      facultyName: item.facultyName || "Unknown",
    }));

    const savedKey = 'savedTimetables';
    const savedList = getSavedTimetables(savedKey);

    for (const rec of savedList) {
      if (slotsMatch(rec.slots, slots)) {
        const existingId = rec.shareId || 'N/A';
        setShareLink(`${window.location.origin}/share/${existingId}`);
        setShowSharePopup(true);
        return;
      }
    }

    try {
      const res = await axios.post("/api/save-timetable", {
        title: saveTTName || getCurrentDateTime(),
        slots,
        owner: owner,
        isPublic: sharePublic,
      });

      const newShareId = res?.data?.timetable?.shareId;
      if (newShareId) {
        saveTimetableToLocal(savedKey, { slots, shareId: newShareId, isShared: true });

        slots.forEach(s => {
          saveCourseToLocal({
            courseCode: s.courseCode,
            courseName: s.courseName,
          });
        });

        setShareLink(`${window.location.origin}/share/${newShareId}`);
        setShowSharePopup(true);
      } else {
        showAlert("Failed to generate share link.");
      }
    } catch {
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
      label: "Share",
      color: "yellow",
      icon: "/icons/send.svg",
      onClick: withLoginCheck(handleShare),
    },
    {
      label: "Download",
      color: "green",
      icon: "/icons/download.svg",
      onClick: () => {
        if (!selectedData || selectedData.length === 0) {
          showAlert("No Timetables generated");
          return;
        }
        exportToPDF();
      },
    },
    {
      label: "Save",
      color: "purple",
      icon: "/icons/save.svg",
      onClick: withLoginCheck(() => {
        if (!selectedData || selectedData.length === 0) {
          showAlert("No timetable to save.");
          return;
        }
        setSaveTTName(getCurrentDateTime());
        setShowSavePopup(true);
      }),
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
        <div className="flex flex-row items-end mb-4 ml-2 justify-between w-full">
          <div className="flex flex-row items-end">
            <div className="text-5xl font-pangolin">Your Timetables</div>
            <div className="text-xl ml-8 font-poppins pb-1">
              {timetableCount == 0
                ? "(Empty List)"
                : timetableCount == 1
                  ? "(1 timetable was generated)"
                  : `(${timetableCount} timetables were generated)`}
            </div>
          </div>
          <div className="mr-4" style={{ width: 400 }}>
            <ComboBox
              label="Filter by Faculty"
              value={filterFaculty}
              options={facultyList}
              onChange={setFilterFaculty}
            />
          </div>
        </div>

        <div className="w-full max-w-[95vw] my-4">
          <CompoundTable data={convertedData} large={true} />
        </div>

        <div className="flex flex-row items-center justify-between px-16 pt-4 gap-8">
          <div className="w-auto">
            <div className=" w-full flex justify-center">
              <button
                onClick={
                  timetableNumber === 1 ? undefined : () => setSelectedIndex(0)
                }
                disabled={timetableNumber === 1}
                title="Go to first timetable"
                aria-label="Go to first timetable"
                className={` ${timetableNumber === 1 ? "bg-[#6CC0C5]" : "bg-[#75E5EA]"
                  } font-poppins border-2 border-black font-semibold flex items-center justify-center text-center transition duration-100 h-12 w-12 rounded-l-xl shadow-[4px_4px_0_0_black] ${timetableNumber === 1 ? "cursor-normal" : "cursor-pointer"
                  } ${timetableNumber === 1
                    ? ""
                    : "active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]"
                  }`}
              >
                <span style={{ pointerEvents: "none", display: "flex" }}>
                  <Image
                    src="/icons/start.svg"
                    alt="Go to first timetable"
                    width={32}
                    height={32}
                    unselectable="on"
                    draggable={false}
                    priority
                  />
                </span>
              </button>

              <div className="flex flex-row">
                {visibleIndexes.map((index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index - 1)}
                    aria-label={`Go to timetable ${index}`}
                    title={`Go to timetable ${index}`}
                    className={` ${timetableNumber === index
                      ? "bg-[#6CC0C5]"
                      : "bg-[#75E5EA]"
                      } font-poppins border-2 border-black font-bold text-lg flex items-center justify-center text-center transition duration-100 h-12 w-12 shadow-[4px_4px_0_0_black] ${timetableNumber === index
                        ? "cursor-normal"
                        : "cursor-pointer"
                      } ${timetableNumber === index
                        ? ""
                        : "active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]"
                      }`}
                  >
                    {index}
                  </button>
                ))}
              </div>

              <button
                onClick={
                  timetableNumber === timetableCount
                    ? undefined
                    : () => setSelectedIndex(timetableCount - 1)
                }
                disabled={timetableNumber === timetableCount}
                title="Go to last timetable"
                aria-label="Go to last timetable"
                className={` ${timetableNumber === timetableCount
                  ? "bg-[#6CC0C5]"
                  : "bg-[#75E5EA]"
                  } font-poppins border-2 border-black font-semibold flex items-center justify-center text-center transition duration-100 h-12 w-12 rounded-r-xl shadow-[4px_4px_0_0_black] ${timetableNumber === timetableCount
                    ? "cursor-normal"
                    : "cursor-pointer"
                  } ${timetableNumber === timetableCount
                    ? ""
                    : "active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]"
                  }`}
              >
                <span style={{ pointerEvents: "none", display: "flex" }}>
                  <Image
                    src="/icons/end.svg"
                    alt="Go to last timetable"
                    width={32}
                    height={32}
                    unselectable="on"
                    draggable={false}
                    priority
                  />
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {actionButtons.map((btn, idx) => (
              <div key={idx}>
                <ZButton
                  type="long"
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
          action={() => signIn("google", { callbackUrl: "/", redirect: true })}
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
        color="yellow"
      />

      {isSaving && <LoadingPopup isLoading={isSaving} />}
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
