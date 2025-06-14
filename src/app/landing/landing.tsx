"use client";

import React from "react";
import Image from "next/image";

import Hero from "@/components/ui/Hero";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

import FacultySelector from "@/components/cards/FacultySelector";
import CourseCard from "@/components/cards/CourseCard";
import ViewTimeTable from "@/components/timetable/ViewTimeTable";
import { TimetableProvider } from "@/components/timetable/TimeTableContext";

export default function View() {
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

      <Navbar page="landing" loggedin={false} />

      <Hero />

      <div className="max-w-6xl mx-4 pt-12" id="start">
        <FacultySelector
          domains={[
            "Foundation Core",
            "DLES",
            "Discipline Core",
            "NGCR",
            "Open Elective",
          ]}
          subjects={[]}
          slots={[]}
          faculties={[
            "Faculty Name 1",
            "Professor Name 2",
            "Dr. G Vishwanathan",
          ]}
          onConfirm={() => { }}
          onReset={() => { }}
        />
      </div>

      <TimetableProvider>

        <div className="w-full px-8">
          <CourseCard />
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
};
