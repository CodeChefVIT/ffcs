import React, { useState, useRef } from "react";

interface Course {
    id: string;
    codes: string[];
    names: string[];
    rooms: string;
}

const initialCourses: Course[] = [
    {
        id: "course1",
        codes: ["BBRT101L", "BBRT101P"],
        names: ["Engineering Rizzology", "Engineering Rizzology Lab"],
        rooms: "B2, D2, G2",
    },
    {
        id: "course2",
        codes: ["BBRT102L"],
        names: ["Sigma Theory"],
        rooms: "A1+TA1, F1+TF1",
    },
    {
        id: "course3",
        codes: ["BBRT103P"],
        names: ["Skibidi Programming Lab"],
        rooms: "L22+L23",
    },
    {
        id: "course4",
        codes: ["BBRT104E"],
        names: ["Delulu NPC Studies"],
        rooms: "TG2",
    },
    {
        id: "course5",
        codes: ["BBRT101S"],
        names: ["Testing extra "],
        rooms: "TG2, TG3",
    },
    {
        id: "course6",
        codes: ["BCSE101L"],
        names: ["OOPS with Rizz"],
        rooms: "G1,G2",
    },
];

export const CourseCard: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const draggedItemIndex = useRef<number | null>(null);
    const dragOverItemIndex = useRef<number | null>(null);

    const handleDragStart = (index: number) => {
        draggedItemIndex.current = index;
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
            draggedItemIndex.current = null;
            dragOverItemIndex.current = null;
            return;
        }

        const updatedCourses = [...courses];
        const [draggedCourse] = updatedCourses.splice(draggedIdx, 1);
        updatedCourses.splice(dragOverIdx, 0, draggedCourse);
        setCourses(updatedCourses);

        draggedItemIndex.current = null;
        dragOverItemIndex.current = null;
    };

    const deleteCourse = (id: string) => {
        setCourses((prev) => prev.filter((c) => c.id !== id));
    };

    const handleGenerate = () => {
        alert(
            "Course order:\n" +
            courses.map((c, i) => `${i + 1}. ${c.codes.join(", ")}`).join("\n")
        );
    };

    return (
        <>
            <style>
                {`
          body {
            font-family: "Poppins", sans-serif;
          }
          .font-pangolin {
            font-family: "Pangolin", cursive;
          }
          .dragging {
            opacity: 0.5;
          }
          .scrollbar-custom::-webkit-scrollbar {
            width: 16px;
            background: transparent;
          }
          .scrollbar-custom::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 12px;
            position: relative;
           
            box-shadow: inset 0 40px 0 0 transparent, inset 0 -40px 0 0 transparent;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb {
            background-color: rgba(107, 114, 128, 0.3); 
            border-radius: 12px;
            border: 3px solid transparent;
            background-clip: content-box;
            cursor: pointer;
            height: 12px !important; 
            transition: background-color 0.3s ease, opacity 0.3s ease;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background-color: rgba(75, 85, 99, 0.7); 
            opacity: 1;
          }
          .scrollbar-custom::-webkit-scrollbar-button {
            display: none;
          }
         
          .scrollbar-custom {
            scrollbar-width: thin;
            scrollbar-color: rgba(107, 114, 128, 0.3) transparent;
          }
        `}
            </style>

            <div className="bg-[#b4dcdc] m-4 rounded-2xl border-[3px] border-black p-6 text-gray-900 font-medium">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-pangolin">Your Courses</h2>
                    <p className="text-xs text-red-700 max-w-xs text-right">
                        *Use arrows or drag-drop to set course priority, multiple timetables
                        will be generated.
                    </p>
                </div>

                <div
                    id="course-list"
                    className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-2 font-poppins scrollbar-custom"
                >
                    {courses.map((course, index) => (
                        <div
                            key={course.id}
                            className="course-row bg-[#d5f2f2] rounded-xl px-6 py-4 flex items-start justify-between space-x-4"
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="flex flex-col min-w-[70px] text-sm items-end">
                                <div className="flex min-w-[100px] items-start">
                                    <div className="w-6 text-right mr-2 text-sm">
                                        {index + 1}.
                                    </div>
                                    <div className="flex flex-col text-sm">
                                        {course.codes.map((code) => (
                                            <p key={code}>{code}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col min-w-[200px] text-sm">
                                {course.names.map((name, i) => (
                                    <p key={i} className={i > 0 ? "-mt-1" : ""}>
                                        {name}
                                    </p>
                                ))}
                            </div>

                            <div className="flex flex-col min-w-[120px] text-sm text-right">
                                {course.rooms.split("\n").map((room, idx) => (
                                    <div key={idx}>{room}</div>
                                ))}
                            </div>

                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => deleteCourse(course.id)}
                                    className="bg-white hover:bg-red-500 text-gray-800 hover:text-white p-2 rounded-lg shadow transition"
                                    title="Delete Course"
                                    type="button"
                                >
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
                                            d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12zM10 11v6m4-6v6"
                                        />
                                    </svg>
                                </button>

                                <button
                                    className="drag-handle bg-white hover:bg-gray-300 text-gray-800 p-2 rounded-full shadow transition cursor-move"
                                    title="Drag to reorder"
                                    type="button"
                                >
                                    ⠿
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <button
                        id="generate-btn"
                        className="border-2 border-black bg-[#7ce5e5] hover:bg-[#67d2d2] text-black font-semibold text-lg px-6 py-2 rounded-full shadow-[4px_4px_0_0_black] transition flex items-center justify-center gap-2 mx-auto"
                        onClick={handleGenerate}
                        type="button"
                    >
                        <span>Generate</span>
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
        </>
    );
};

export default CourseCard;