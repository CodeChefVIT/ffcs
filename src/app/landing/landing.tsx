"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import Hero from "@/components/ui/Hero";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Accordion from "@/components/ui/Accordion";

import FacultySelector from "@/components/cards/FacultySelector";
import CourseCard from "@/components/cards/CourseCard";
import ViewTimeTable from "@/components/cards/ViewTimeTable";
import { TimetableProvider } from "@/lib/TimeTableContext";
import { fullCourseData } from "@/lib/type";
const LOCAL_STORAGE_KEY = "selectedCourses";

export default function View() {
  const [selectedCourses, setSelectedCourses] = useState<fullCourseData[]>(
    () => {
      if (typeof window === "undefined") return [];
      try {
        const saved = localStorage.getItem("selectedCourses");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
  );

  const facultySelectorOnConfirm = (newCourse: fullCourseData) => {
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

        const mergedSlots = [...preservedOldSlots, ...updatedSlots];

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
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedCourses));
    } catch (e) {
      console.error("Failed to save courses to localStorage", e);
    }
  }, [selectedCourses]);

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
          draggable={false}
          unselectable="on"
        />
      </div>
      <Navbar page="landing" />

      <Hero page="normal" />

      <div className="w-4xl mx-4 pt-12" id="start">
        <FacultySelector onConfirm={facultySelectorOnConfirm} />
      </div>

      <TimetableProvider>
        <div className="w-full px-8">
          <CourseCard
            selectedCourses={selectedCourses}
            onDelete={(id) =>
              setSelectedCourses((prev) => prev.filter((c) => c.id !== id))
            }
            onUpdate={(updatedCourses) => setSelectedCourses(updatedCourses)}
          />
        </div>

        <div className="w-screen p-0 m-0">
          <ViewTimeTable />
        </div>
      </TimetableProvider>
      <div className="mt-12" />
      <Accordion />

      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-12 m-32">
        <Image
          src="/art/graphic.svg"
          alt="graphic"
          width={0}
          height={0}
          className="w-full h-auto"
          priority
          draggable={false}
          unselectable="on"
        />
      </div>

      <Footer />
    </div>
  );
}
