"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTimetable } from "../../lib/TimeTableContext";
import Popup from "../ui/Popup";
import { BasicToggleButton, ZButton } from "../ui/Buttons";
import Image from "next/image";
import { generateTT } from "@/lib/utils";
import { fullCourseData } from "@/lib/type";
import { setGlobalCourses } from "@/lib/globalCourses";
import AlertModal from "../ui/AlertModal";

type CourseCardProps = {
  selectedCourses: fullCourseData[];
  onDelete: (id: string) => void;
  onUpdate: (updatedCourses: fullCourseData[]) => void;
};

export default function CourseCard({
  selectedCourses,
  onDelete,
  onUpdate,
}: CourseCardProps) {
  const { setTimetableData } = useTimetable();

  const draggedItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<fullCourseData | null>(null);

  const [allSubjectsMode, setAllSubjectsMode] = useState<"on" | "off">("on");

  const [showInfo, setShowInfo] = useState(false);
  const [deleteAllPopupOpen, setDeleteAllPopupOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);




  const [alert, setAlert] = useState({
    open: false,
    message: "",
    color: "red",
  });

  const handleDeleteAllCourses = () => {
    onUpdate([]);
    setGlobalCourses([]);
  };

  const resetDragRefs = () => {
    draggedItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      const updatedCourses = selectedCourses.filter(
        (c) => c.id !== courseToDelete.id
      );
      onDelete(courseToDelete.id);
      onUpdate(updatedCourses);

      setGlobalCourses(updatedCourses);
      //const { result } = generateTT(updatedCourses);
      // setTimetableData(result);
    }

    setDeletePopupOpen(false);
    setCourseToDelete(null);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    draggedItemIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const handleDragEnd = () => {
    const draggedIdx = draggedItemIndex.current;
    const dragOverIdx = dragOverItemIndex.current;

    if (
      draggedIdx === null ||
      dragOverIdx === null ||
      draggedIdx === dragOverIdx
    ) {
      resetDragRefs();
      return;
    }

    const updatedCourses = [...selectedCourses];
    const [draggedCourse] = updatedCourses.splice(draggedIdx, 1);
    updatedCourses.splice(dragOverIdx, 0, draggedCourse);
    onUpdate(updatedCourses);
    resetDragRefs();
  };

  const moveCourseUp = (index: number) => {
    if (index === 0) return;
    const updatedCourses = [...selectedCourses];
    [updatedCourses[index - 1], updatedCourses[index]] = [
      updatedCourses[index],
      updatedCourses[index - 1],
    ];
    onUpdate(updatedCourses);
  };

  const moveCourseDown = (index: number) => {
    if (index === selectedCourses.length - 1) return;
    const updatedCourses = [...selectedCourses];
    [updatedCourses[index + 1], updatedCourses[index]] = [
      updatedCourses[index],
      updatedCourses[index + 1],
    ];
    onUpdate(updatedCourses);
  };

  const handleGenerate = async () => {
    if (selectedCourses.length === 0) {
      setError("Please add at least one course to generate a timetable.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { result } = generateTT(selectedCourses, allSubjectsMode === "on");

      if (!result || result.length === 0) {
        setTimetableData([]);
        setAlert({
          open: true,
          message: "No timetables were generated because there were clashes in all possible timetables. Please adjust your courses or mode.",
          color: "red",
        });
      } else {
        setTimetableData(result);
        setGlobalCourses(selectedCourses);
        setAlert({
          open: false,
          message: "",
          color: "red",
        });

        setTimeout(() => {
          const el = document.getElementById("timetable-view");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch {
      setError("Failed to generate timetable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-12">
      <AlertModal
        open={alert.open}
        message={alert.message}
        color={alert.color}
        onClose={() => setAlert({ ...alert, open: false })}
      />

      <AlertModal
        open={showInfo}
        message={
          "**All Subjects Mode - ON**\nGenerated timetables strictly include all of the selected subjects.\n\n**All Subjects Mode - OFF**\nSubjects are prioritized based on their order. If a clash is detected then the subject with lower priority is excluded."
        } color="yellow"
        onClose={() => setShowInfo(false)}
      />

      <div
        id="course-card"
        className="bg-[#A7D5D7] mt-4 font-poppins rounded-4xl border-[3px] border-black p-6 shadow-[4px_4px_0_0_black] text-black font-medium px-12 mb-16"
      >
        <div className="flex justify-between items-start mt-4">
          <h2 className="text-3xl font-pangolin">Your Courses</h2>
          <div className="text-sm text-[#B93C21] text-right mr-6">
            *Use arrows or drag-drop to set course priority,
            <br />
            multiple timetables will be generated.
          </div>
        </div>

        <div
          id="course-list"
          className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-2 font-poppins w-full"
        >
          {selectedCourses.map((course, index) => (
            <div
              key={`${course.id}-${index}`}
              className="course-row bg-[#ffffff]/40 rounded-3xl px-6 py-4 flex flex-row items-center justify-between gap-2 sm:space-x-4 w-full cursor-grab active:cursor-grabbing"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Course Codes */}
              <div className="flex items-center w-[120px] text-sm text-black font-normal">
                <div className="flex items-start">
                  <div className="w-6 text-right mr-4 text-sm font-inter">
                    {index + 1}.
                  </div>
                  <div className={"flex flex-col px-4 gap-1"}>
                    <p key={course.courseCode}>{course.courseCode}</p>
                    {course.courseType === "both" && !course.courseCode.endsWith("E") && (
                      <p key={course.courseCodeLab + "_lab"}>
                        {course.courseCodeLab}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Course name */}
              <div className="flex w-[480px] text-sm text-black font-normal">
                <div className="flex flex-col gap-1 break-words max-w-full">
                  <p
                    key={course.courseName}
                    className="break-words leading-snug"
                  >
                    {course.courseName}
                  </p>
                  {course.courseType === "both" && !course.courseCode.endsWith("E") && (
                    <p
                      key={course.courseNameLab + "_lab"}
                      className="break-words leading-snug"
                    >
                      {course.courseNameLab}
                    </p>
                  )}
                </div>
              </div>

              {/* Slots */}
              <div className="flex items-center w-[120px] text-sm text-left text-black font-normal">
                <div className="flex flex-col gap-1">
                  {course.courseType == "lab" && (
                    <p
                      key={course.courseName + "slot"}
                      className="break-words leading-snug"
                    >
                      (Lab)
                    </p>
                  )}
                  {course.courseType != "lab" && (
                    <p
                      key={course.courseName + "slot"}
                      className="break-words leading-snug"
                    >
                      {course.courseSlots
                        .map((slot) => slot.slotName)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setCourseToDelete(course);
                    setDeletePopupOpen(true);
                  }}
                  aria-label="Delete Course"
                  className="bg-[#FFFFFF]/50 hover:bg-[#F08585] text-black rounded-lg transition cursor-pointer w-10 h-10 flex items-center justify-center flex-shrink-0"
                  type="button"
                  title="Delete Course"
                >
                  <Image
                    src={"/icons/trash.svg"}
                    width={1}
                    height={1}
                    alt="delete"
                    className="w-6 h-6"
                    unselectable="on"
                    draggable={false}
                    priority
                  />
                </button>

                <div className="flex flex-col bg-[#FFFFFF]/50 rounded-xl overflow-hidden leading-none gap-0 p-1 flex-shrink-0 w-8 h-12 -mr-2">
                  <button
                    onClick={() => moveCourseUp(index)}
                    aria-label="Move Course Up"
                    className="px-1 py-0.5 m-0 leading-none transition rounded-t-lg cursor-pointer w-6 h-6 flex items-center justify-center"
                    type="button"
                    title="Move Up"
                    disabled={index === 0}
                  >
                    <Image
                      src={
                        index === 0
                          ? "/icons/chevron_up_gray.svg"
                          : "/icons/chevron_up.svg"
                      }
                      width={1}
                      height={1}
                      alt="up"
                      className="w-3 h-3"
                      unselectable="on"
                      draggable={false}
                      priority
                    />
                  </button>

                  <button
                    onClick={() => moveCourseDown(index)}
                    aria-label="Move Course Down"
                    className="px-1 py-0.5 m-0 leading-none transition rounded-b-lg cursor-pointer w-6 h-6 flex items-center justify-center"
                    type="button"
                    title="Move Down"
                    disabled={index === selectedCourses.length - 1}
                  >
                    <Image
                      src={
                        index === selectedCourses.length - 1
                          ? "/icons/chevron_down_gray.svg"
                          : "/icons/chevron_down.svg"
                      }
                      width={1}
                      height={1}
                      alt="down"
                      className="w-3 h-3"
                      unselectable="on"
                      draggable={false}
                      priority
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLargeScreen ? (
          
          <div className="flex justify-between items-center mt-8 mb-4 relative w-full">
            {/* Toggle */}
            <div className="mr-auto flex items-center gap-2">
              <div className="mr-2">
                <ZButton
                  image="/icons/qmark.svg"
                  color="yellow"
                  type="small"
                  onClick={() => setShowInfo(true)}
                />
              </div>
              <span className="text-md text-black font-semibold mr-0">
                All Subjects Mode
              </span>
              <BasicToggleButton
                defaultState={allSubjectsMode}
                onToggle={() =>
                  setAllSubjectsMode((prev) => (prev === "on" ? "off" : "on"))
                }
              />
              <span className="text-md text-black font-semibold ml-2">
                {allSubjectsMode === "on" ? "ON" : "OFF"}
              </span>
            </div>

            {/* Generate */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <ZButton
                type="large"
                text={loading ? "Generating..." : "Generate"}
                image="/icons/thunder.svg"
                color="blue"
                disabled={loading}
                onClick={handleGenerate}
              />
            </div>

            {/* Delete All Button */}
            <div className="ml-auto flex items-center">
              <ZButton
                type="regular"
                text="Remove all"
                image="/icons/trash.svg"
                color="red"
                onClick={() => setDeleteAllPopupOpen(true)}
              />
            </div>
          </div>
        ) : (
          
          // Mobile / Tablet View

          <div className="mt-8 mb-4 w-full flex flex-col gap-4">
            {/* Top Row */}
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="mr-2">
                  <ZButton
                    image="/icons/qmark.svg"
                    color="yellow"
                    type="small"
                    onClick={() => setShowInfo(true)}
                  />
                </div>
                <span className="text-md text-black font-semibold mr-2">
                  All Subjects Mode
                </span>
                <BasicToggleButton
                  defaultState={allSubjectsMode}
                  onToggle={() =>
                    setAllSubjectsMode((prev) => (prev === "on" ? "off" : "on"))
                  }
                />
                <span className="text-md text-black font-semibold ml-4">
                  {allSubjectsMode === "on" ? "ON" : "OFF"}
                </span>
              </div>

              <div className="flex items-center">
                <ZButton
                  type="regular"
                  text="Remove all"
                  image="/icons/trash.svg"
                  color="red"
                  onClick={() => setDeleteAllPopupOpen(true)}
                />
              </div>
            </div>

            {/* Bottom Row*/}
            <div className="flex justify-center w-full py-4">
              <ZButton
                type="large"
                text={loading ? "Generating..." : "Generate"}
                image="/icons/thunder.svg"
                color="blue"
                disabled={loading}
                onClick={handleGenerate}
              />
            </div>
          </div>
        )}



        {error && (
          <div
            className="mt-6 text-center text-[#CC3312] font-semibold"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>

      {deletePopupOpen && courseToDelete && (
        <Popup
          type="rem_course"
          dataBody={
            courseToDelete.courseName +
            (courseToDelete.courseType === "both"
              ? ` & ${courseToDelete.courseNameLab}`
              : "")
          }
          action={confirmDeleteCourse}
          closeLink={() => {
            setDeletePopupOpen(false);
            setCourseToDelete(null);
          }}
        />
      )}

      {deleteAllPopupOpen && (
        <Popup
          type="rem_allcourse"
          dataBody=""
          action={() => {
            handleDeleteAllCourses();
            setDeleteAllPopupOpen(false);
          }}
          closeLink={() => setDeleteAllPopupOpen(false)}
        />
      )}

    </div>
  );
}
