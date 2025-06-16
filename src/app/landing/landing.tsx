"use client";

import React, { useState } from "react";
import Image from "next/image";

import Hero from "@/components/ui/Hero";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

import FacultySelector from "@/components/cards/FacultySelector";
import CourseCard from "@/components/cards/CourseCard";
import ViewTimeTable from "@/components/cards/ViewTimeTable";
import { TimetableProvider } from "@/lib/TimeTableContext";
import { fullCourseData } from "@/lib/type";
export default function View() {
  const [selectedCourses, setSelectedCourses] = useState<fullCourseData[]>([]);

  return (
    <div className="flex flex-col min-h-screen relative w-full items-center justify-center overflow-x-hidden">
      <div className="absolute inset-0 -z-10 bg-[#CEE4E5]">
        <Image
          src="/art/bg_dots.svg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-top object-contain w-full h-full"
        />
      </div>

      <Navbar page="landing" />

      <Hero />

      <div className="max-w-6xl mx-4 pt-12" id="start">
        <FacultySelector
          onConfirm={(newCourse) => {
            setSelectedCourses((prevCourses) => {
              const existingIndex = prevCourses.findIndex(
                (course) => course.id === newCourse.id
              );

              if (existingIndex !== -1) {
                const existingCourse = prevCourses[existingIndex];

                // Replace faculty lists for matching slotNames, and add new ones if not already present
                const updatedSlots = newCourse.courseSlots.map((newSlot) => {
                  const existingSlot = existingCourse.courseSlots.find(
                    (slot) => slot.slotName === newSlot.slotName
                  );

                  if (existingSlot) {
                    // Replace the faculty list
                    return {
                      ...existingSlot,
                      slotFaculties: newSlot.slotFaculties,
                    };
                  } else {
                    // New slot, just add it
                    return newSlot;
                  }
                });

                // Merge any slots from existingCourse that are not in newCourse
                const preservedOldSlots = existingCourse.courseSlots.filter(
                  (oldSlot) =>
                    !newCourse.courseSlots.some(
                      (newSlot) => newSlot.slotName === oldSlot.slotName
                    )
                );

                const mergedSlots = [...updatedSlots, ...preservedOldSlots];

                const updatedCourse = {
                  ...existingCourse,
                  courseSlots: mergedSlots,
                };

                const updatedCourses = [...prevCourses];
                updatedCourses[existingIndex] = updatedCourse;
                return updatedCourses;
              } else {
                // New course, add directly
                return [...prevCourses, newCourse];
              }
            });
          }}
        />
      </div>

      <TimetableProvider>
        <div className="w-full px-8">
          <CourseCard selectedCourses={selectedCourses} />
        </div>

        <div className="w-screen p-0 m-0">
          <ViewTimeTable />
        </div>
      </TimetableProvider>

      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-12 m-32">
        <Image
          src="/art/graphic.svg"
          alt="graphic"
          width={0}
          height={0}
          className="w-full h-auto"
          priority
        />
      </div>

      <Footer />
    </div>
  );
}
