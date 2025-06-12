import React, { useState, useRef } from "react";
import DeletePopup from "./popups/delete_popup";

interface Course {
  id: string;
  codes: string[];
  names: string[];
  slots: string | string[];
}

const initialCourses: Course[] = [
  {
    id: "course1",
    codes: ["BBRT101L", "BBRT101P"],
    names: ["Engineering Rizzology", "Engineering Rizzology Lab"],
    slots: ["B2+TB2" ,"L47+L48" ],
  },
  {
    id: "course2",
    codes: ["BBRT102L"],
    names: ["Sigma Theory"],
    slots: "A1+TA1, F1+TF1",
  },
  {
    id: "course3",
    codes: ["BBRT103P"],
    names: ["Skibidi Programming Lab"],
    slots: "L22+L23",
  },
  {
    id: "course4",
    codes: ["BBRT104E"],
    names: ["Delulu NPC Studies"],
    slots: "TG2",
  },
  {
    id: "course5",
    codes: ["BBRT101S"],
    names: ["Testing extra "],
    slots: "TG2, TG3",
  },
  {
    id: "course6",
    codes: ["BCSE101L"],
    names: ["OOPS with Rizz"],
    slots: "G1,G2",
  },
];

// Simulated backend save with validation
const saveCourses = (courses: Course[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for (const course of courses) {
        if (
          !course.id ||
          !Array.isArray(course.codes) ||
          course.codes.length === 0 ||
          course.codes.some((code) => !code || code.trim() === "") ||
          !Array.isArray(course.names) ||
          course.names.length === 0 ||
          course.names.some((name) => !name || name.trim() === "") ||
          !Array.isArray(course.slots) ||
          course.slots.length === 0 ||
          course.slots.some(
            (slot) => typeof slot !== "string" || slot.trim() === ""
          )
        ) {
          reject(
            new Error(
              `Invalid course data detected for course with id "${course.id}". Please check all fields.`
            )
          );
          return;
        }
      }
      resolve();
    }, 1000);
  });
};

export const CourseCard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const draggedItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const [saving, setSaving] = useState(false);

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

  // Instead of deleting immediately, open popup

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
    setSaving(true);
    try {
      await saveCourses(courses);
      alert(
        "Courses saved successfully!\n\nCourse order:\n" +
          courses.map((c, i) => `${i + 1}. ${c.codes.join(", ")}`).join("\n")
      );
    } catch (error) {
      if (error instanceof Error) {
        alert("Failed to save courses:\n" + error.message);
      } else {
        alert("Failed to save courses due to an unknown error.");
      }
    }
    setSaving(false);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Pangolin&display=swap');
        .font-pangolin { font-family: "Pangolin", cursive; }
        .font-poppins { font-family: "Poppins", sans-serif; }

        .scrollbar-custom::-webkit-scrollbar { width: 16px; background: transparent; }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent; border-radius: 12px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: rgba(107, 114, 128, 0.3); 
          border-radius: 12px; border: 3px solid transparent;
          background-clip: content-box; cursor: pointer;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background-color: rgba(75, 85, 99, 0.7); 
        }
        .scrollbar-custom { scrollbar-width: thin; scrollbar-color: rgba(107, 114, 128, 0.3) transparent; }
      `}
      </style>

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
          className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-2 font-poppins scrollbar-custom w-full"
        >
          {courses.map((course, index) => (
            <div
              key={`${course.id}-${index}`}
              className="course-row bg-[#FBFDFC66] rounded-3xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:space-x-4 w-full"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Codes */}
              <div className="flex items-center sm:min-w-[400px] text-sm text-black font-normal">
                <div className="flex items-start">
                  <div className="w-6 text-right mr-2 text-sm">
                    {index + 1}.
                  </div>
                  <div
                    className={`flex flex-col px-4 ${
                      course.codes.length > 1 ? "space-y-1" : ""
                    }`}
                  >
                    {course.codes.map((code) => (
                      <p key={code}>{code}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Names */}
              <div className="flex items-start sm:min-w-[200px] text-sm text-black font-normal">
                <div
                  className={`flex flex-col ${
                    course.names.length > 1 ? "space-y-1" : ""
                  }`}
                >
                  {course.names.map((name, i) => (
                    <p key={i}>{name}</p>
                  ))}
                </div>
              </div>

              {/* Slots */}
              <div className="flex items-center sm:min-w-[120px] text-sm text-right text-black font-normal">
                <div className="flex flex-col space-y-1">
                  {Array.isArray(course.slots)
                    ? course.slots.map((slot, idx) => (
                        <div key={idx}>{slot}</div>
                      ))
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
              saving ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={handleGenerate}
            type="button"
            disabled={saving}
          >
            <span>{saving ? "Saving..." : "Generate"}</span>
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
        </div>
      </div>

      {deletePopupOpen && courseToDelete && (
        <DeletePopup
          onConfirm={confirmDeleteCourse}
          onClose={() => {
            setDeletePopupOpen(false);
            setCourseToDelete(null);
          }}
          title="Delete This Course"
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {courseToDelete.names.join(", ")}
              </span>{" "}
              from your timetable?
            </>
          }
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </>
  );
};

export default CourseCard;
