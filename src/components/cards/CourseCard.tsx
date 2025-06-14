"use client";

import React, { useState, useRef } from "react";
import axios from "axios";

import { useTimetable } from "../timetable/TimeTableContext";

import Popup from "../ui/Popup";
import { ZButton } from "../ui/Buttons";
import Image from "next/image";

interface Course {
  id: string;
  codes: string[];
  names: string[];
  slots: string | string[] | string[][];
  facultyName: string | string[] | string[][];
}

const initialCourses: Course[] = [
  {
    id: "course1",
    codes: ["BCSE102L", "BCSE102P"],
    names: ["Structured and Object-Oriented Programming", "Structured and Object-Oriented Programming Lab"],
    slots: [["G1", "L43+L44+L53+L54"], ["G1+TG1"]],
    facultyName: [["DHIVYAA C R "], ["testwa"]]
  },
  {
    id: "course2",
    codes: ["BENG101L", "BENG101P"],
    names: ["Technical English Communication", "Technical English Communication Lab"],
    slots: [["B1", "L45+L46"], ["B1", "L45+L46"]],
    facultyName: [["SOUMEN MUKHERJEE"], ["vishu"]]
  },
  {
    id: "course3",
    codes: ["BHUM101N"],
    names: ["Ethics and Values"],
    slots: "NIL",
    facultyName: "BHUVANESWARI M"
  },
  {
    id: "course4",
    codes: ["BHUM220L"],
    names: ["Financial Markets and Institutions"],
    slots: "C1+TC1",
    facultyName: "SAVITHA N"
  },
  {
    id: "course5",
    codes: ["BMAT101L", "BMAT101P"],
    names: ["Calculus", "Calculus Lab"],
    slots: ["D1+TD1", "L35+L36"],
    facultyName: "ARUN KUMAR BADAJENA"
  },
  {
    id: "course6",
    codes: ["BPHY101L", "BPHY101P"],
    names: ["Engineering Physics", "Engineering Physics Lab"],
    slots: ["E1+TE1", "L47+L48"],
    facultyName: "KANHAIYA LAL PANDEY"
  },
  {
    id: "course7",
    codes: ["BSTS101P"],
    names: ["Quantitative Skills Practice I"],
    slots: "F1+TF1",
    facultyName: "SIXPHRASE (APT)"
  },
  {
    id: "course",
    codes: ["BSTFU-101"],
    names: ["Vissus Rizzology"],
    slots: "F1+TF1",
    facultyName: "VISSU",
  },

];

export default function CourseCard() {
  const { setTimetableData } = useTimetable();

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const draggedItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const resetDragRefs = () => {
    draggedItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));
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
    setLoading(true);
    setError(null);

    try {
      const generateData = courses.map((course) => {
        // Check if array of array
        if (
          Array.isArray(course.facultyName) &&
          Array.isArray(course.slots) &&
          Array.isArray(course.facultyName[0]) &&
          Array.isArray(course.slots[0])
        ) {
          // Pairing + add if seperate members exist
          const facultyArr = course.facultyName as string[][];
          const slotsArr = course.slots as string[][];
          return facultyArr.map((faculty, idx) => ({
            faculty: faculty.length > 1 ? faculty.join(" + ") : faculty[0] ?? "NIL",
            facultySlot:
              slotsArr[idx]?.length > 0
                ? [slotsArr[idx].join("+")]
                : ["NIL"],
          }));
        } else {
          const slotsArray = Array.isArray(course.slots)
            ? course.slots
            : [course.slots];

          const facultySlots = slotsArray
            .map((slotStr) => {
              if (typeof slotStr === "string") {
                return slotStr.split("+").map((slot) => slot.trim());
              } else if (Array.isArray(slotStr)) {
                return slotStr.flatMap((s) =>
                  typeof s === "string"
                    ? s.split("+").map((slot) => slot.trim())
                    : []
                );
              }
              return [];
            })
            .flat()
            .filter((slot) => slot !== "" && slot.toUpperCase() !== "NIL");

          return [
            {
              faculty: course.facultyName,
              facultySlot: facultySlots.length > 0 ? facultySlots : ["NIL"],
            },
          ];
        }
      });

      const facultyData = courses.map((course) => course.codes.join("/"));

      const payload = {
        slotTime: "Both",
        generateData,
        facultyData,
      };
      const response = await axios.post("/api/generate", payload);

      if (response?.data) {
        setTimetableData(response.data);

        setTimeout(() => {
          const el = document.getElementById("timetable-view");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } catch (err: unknown) {
      setError("Failed to generate timetable. Please try again.");
      if (err instanceof Error) {
        console.error(err.message); // Optional: log error message
      } else {
        console.error("Unknown error", err);
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-12">
      <div id="course-card" className="bg-[#A7D5D7] mt-4 font-poppins rounded-4xl border-[3px] border-black p-6 shadow-[4px_4px_0_0_black] text-black font-medium px-12 mb-16">
        <div className="flex justify-between items-start mt-4">
          <h2 className="text-3xl font-pangolin">Your Courses</h2>
          <div className="text-sm text-[#B93C21] text-right mr-6">
            *Use arrows or drag-drop to set course priority,<br />
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
                  <div className="w-6 text-right mr-4 text-sm font-inter">{index + 1}.</div>
                  <div
                    className={`flex flex-col px-4 ${course.codes.length > 1 ? "space-y-1" : ""}`}
                  >
                    {course.codes.map((code) => (
                      <p key={code}>{code}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course namee */}
              <div className="flex w-[480px] text-sm text-black font-normal">
                <div className="flex flex-col space-y-1 break-words max-w-full">
                  {course.names.map((name, i) => (
                    <p key={i} className="break-words leading-snug">
                      {name}
                    </p>
                  ))}
                </div>
              </div>


              {/* Slots */}
              <div className="flex items-center w-[120px] text-sm text-left text-black font-normal">
                <div className="flex flex-col space-y-1">
                  {Array.isArray(course.slots)
                    ? course.slots.map((slot, idx) => <div key={idx}>{slot}</div>)
                    : course.slots.split("\n").map((slot, idx) => <div key={idx}>{slot}</div>)}
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
                  <Image src={"/icons/trash.svg"} width={1} height={1} alt="delete" className="w-6 h-6" />
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
                      src={index === 0 ? "/icons/chevron_up_gray.svg" : "/icons/chevron_up.svg"}
                      width={1}
                      height={1}
                      alt="up"
                      className="w-3 h-3"
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
                      src={index === courses.length - 1 ? "/icons/chevron_down_gray.svg" : "/icons/chevron_down.svg"}
                      width={1}
                      height={1}
                      alt="down"
                      className="w-3 h-3"
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

        {error && (<div className="mt-6 text-center text-[#CC3312] font-semibold" role="alert">{error}</div>)}

      </div>

      {deletePopupOpen && courseToDelete && (
        <Popup
          type="rem_course"
          dataBody={courseToDelete.names.join(", ")}
          action={confirmDeleteCourse}
          closeLink={() => {
            setDeletePopupOpen(false);
            setCourseToDelete(null);
          }}
        />
      )}
    </div>
  );
};
