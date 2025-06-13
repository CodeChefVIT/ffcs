import React, { useState, useRef } from "react";
import { useTimetable } from "../components/timetable/TimeTableContext";
import axios from "axios";
import Popup from "./ui/Popup";

interface Course {
  id: string;
  codes: string[];
  names: string[];
  slots: string | string[]| string[][];
  facultyName: string | string[]| string[][];
}

const initialCourses: Course[] = [
  {
    id: "course1",
    codes: ["CSE102L", "BCSE102P"],
    names: ["Structured and Object-Oriented Programming", "Structured and Object-Oriented Programming Lab"],
    slots: [["G1","L43+L44+L53+L54"], ["G1+TG1"]],
    facultyName: [["DHIVYAA C R "],["testwa"]]
  },
  {
    id: "course2",
    codes: ["BENG101L", "BENG101P"],
    names: ["Technical English Communication", "Technical English Communication Lab"],
    slots: [["B1", "L45+L46"],["B1", "L45+L46"]],
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
 
];

export const CourseCard: React.FC = () => {
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
      setTimetableData(response.data);
    } catch (err: any) {
      setError("Failed to generate timetable. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#A7D5D7] m-4 font-poppins rounded-2xl border-[3px] border-black p-6 text-black font-medium px-12 mb-16">
        <div className="flex justify-between items-start mt-4">
          <h2 className="text-3xl font-pangolin">Your Courses</h2>
          <p className="text-sm text-red-700 max-w-xs text-right">
            *Use arrows or drag-drop to set course priority, multiple timetables
            will be generated.
          </p>
        </div>

        <div
          id="course-list"
          className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-2 font-poppins w-full"
        >
          {courses.map((course, index) => (
            <div
              key={`${course.id}-${index}`}
              className="course-row bg-[#FBFDFC66] rounded-3xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:space-x-4 w-full "
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Codes */}
              <div className="flex items-center sm:min-w-[400px] text-sm text-black font-normal">
                <div className="flex items-start">
                  <div className="w-6 text-right mr-2 text-sm">{index + 1}.</div>
                  <div
                    className={`flex flex-col px-4 ${course.codes.length > 1 ? "space-y-1" : ""}`}
                  >
                    {course.codes.map((code) => (
                      <p key={code}>{code}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Names */}
              <div className="flex items-start sm:min-w-[200px] text-sm text-black font-normal">
                <div className={`flex flex-col ${course.names.length > 1 ? "space-y-1" : ""}`}>
                  {course.names.map((name, i) => (
                    <p key={i}>{name}</p>
                  ))}
                </div>
              </div>

              {/* Slots */}
              <div className="flex items-center sm:min-w-[120px] text-sm text-left text-black font-normal">
                <div className="flex flex-col space-y-1">
                  {Array.isArray(course.slots)
                    ? course.slots.map((slot, idx) => <div key={idx}>{slot}</div>)
                    : course.slots
                        .split("\n")
                        .map((slot, idx) => <div key={idx}>{slot}</div>)}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setCourseToDelete(course);
                    setDeletePopupOpen(true);
                  }}
                  aria-label="Delete Course"
                  className="bg-[#FFFFFF80] hover:bg-[#F08585] text-black p-2 rounded-lg shadow transition"
                  type="button"
                  title="Delete Course"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12zM10 11v6m4-6v6"
                    />
                  </svg>
                </button>

                <div className="flex flex-col bg-[#FFFFFF80] rounded-lg shadow-sm overflow-hidden leading-none gap-0 p-1">
                  <button
                    onClick={() => moveCourseUp(index)}
                    aria-label="Move Course Up"
                    className="hover:bg-gray-200 p-0 m-0 leading-none transition rounded-t-lg"
                    type="button"
                    title="Move Up"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveCourseDown(index)}
                    aria-label="Move Course Down"
                    className="hover:bg-gray-200 p-0 m-0 leading-none transition rounded-b-lg"
                    type="button"
                    title="Move Down"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            id="generate-btn"
            className={`border-2 border-black bg-[#7ce5e5] hover:bg-[#67d2d2] text-black font-semibold text-lg px-6 py-2 rounded-full shadow-[4px_4px_0_0_black] transition flex items-center justify-center gap-2 mx-auto ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={handleGenerate}
            type="button"
            disabled={loading}
          >
            <span>{loading ? "Generating..." : "Generate"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 2L3 14h9l-1 8L21 10h-9l1-8z"
              />
            </svg>
          </button>

          {error && (
            <p className="mt-3 text-red-600 font-medium" role="alert">
              {error}
            </p>
          )}
        </div>
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
    </>
  );
};

export default CourseCard;
