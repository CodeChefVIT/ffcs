"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTimetable } from "../../lib/TimeTableContext";
import Popup from "../ui/Popup";
import { ZButton } from "../ui/Buttons";
import Image from "next/image";
import { generateTT } from "@/lib/utils";
import { fullCourseData } from "@/lib/type";
import { setGlobalCourses } from "@/lib/globalCourses";
import AlertModal from "../ui/AlertModal";

type CourseCardProps = {
  selectedCourses: fullCourseData[];
  onDelete: (id: string) => void;
};

const LOCAL_STORAGE_KEY = "selectedCourses";

export default function CourseCard({ selectedCourses, onDelete }: CourseCardProps) {
  const { setTimetableData } = useTimetable();
  const [courses, setCourses] = useState<fullCourseData[]>([]);
  const hasInitialized = useRef(false);

  const draggedItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<fullCourseData | null>(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    color: "red",
  });


  useEffect(() => {
    if (!hasInitialized.current && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setCourses(JSON.parse(saved));
        } else {
          setCourses(selectedCourses);
        }
      } catch {
        setCourses(selectedCourses);
      }
      hasInitialized.current = true;
    }
  }, [selectedCourses]);

  useEffect(() => {
    if (typeof window !== "undefined" && hasInitialized.current) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
      } catch { }
    }
  }, [courses]);


  useEffect(() => {
    if (!hasInitialized.current) return;

    const currentCourseIds = new Set(courses.map((c) => c.id));
    const merged = [
      ...courses,
      ...selectedCourses.filter((c) => !currentCourseIds.has(c.id)),
    ];

    if (merged.length !== courses.length) {
      setCourses(merged);
    }
  }, [selectedCourses]);

  const resetDragRefs = () => {
    draggedItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      onDelete(courseToDelete.id);
      const updatedCourses = courses.filter((c) => c.id !== courseToDelete.id);
      setCourses(updatedCourses);

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCourses));
      } catch (error) {
        console.warn("Failed to update localStorage:", error);
      }

      setGlobalCourses(updatedCourses);
      const { result } = generateTT(updatedCourses);
      setTimetableData(result);
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

    const updatedCourses = [...courses];
    const [draggedCourse] = updatedCourses.splice(draggedIdx, 1);
    updatedCourses.splice(dragOverIdx, 0, draggedCourse);
    setCourses(updatedCourses);
    resetDragRefs();
  };

  const moveCourseUp = (index: number) => {
    if (index === 0) return;
    const updatedCourses = [...courses];
    [updatedCourses[index - 1], updatedCourses[index]] = [
      updatedCourses[index],
      updatedCourses[index - 1],
    ];
    setCourses(updatedCourses);
  };

  const moveCourseDown = (index: number) => {
    if (index === courses.length - 1) return;
    const updatedCourses = [...courses];
    [updatedCourses[index + 1], updatedCourses[index]] = [
      updatedCourses[index],
      updatedCourses[index + 1],
    ];
    setCourses(updatedCourses);
  };

  const handleGenerate = async () => {
    if (courses.length === 0) {
      setError("Please add at least one course to generate a timetable.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { result } = generateTT(courses);

      setGlobalCourses(courses);
      setTimetableData(result);

      setAlert({
        open: false,
        message: "",
        color: "red",
      });

      setTimeout(() => {
        const el = document.getElementById("timetable-view");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
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
          {courses.map((course, index) => (
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
                    {course.courseType === "both" && (
                      <p key={course.courseCodeLab + "_lab"}>{course.courseCodeLab}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Course namee */}
              <div className="flex w-[480px] text-sm text-black font-normal">
                <div className="flex flex-col gap-1 break-words max-w-full">
                  <p key={course.courseName} className="break-words leading-snug">
                    {course.courseName}
                  </p>
                  {course.courseType === "both" && (
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
                    disabled={index === courses.length - 1}
                  >
                    <Image
                      src={
                        index === courses.length - 1
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

        <div className="flex text-center justify-center mt-8 mb-4">
          <ZButton
            type="large"
            text={loading ? "Generating..." : "Generate"}
            image="/icons/thunder.svg"
            color="blue"
            disabled={loading}
            onClick={handleGenerate}
          />
        </div>

        {error && (
          <div className="mt-6 text-center text-[#CC3312] font-semibold" role="alert">
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
    </div>
  );
}