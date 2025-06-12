"use client";

import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/ui//Navbar";
import { Footer } from "@/components/ui/Footer";

import Header from "@/components/Header";
import FacultySelector from "@/components/FacultySelector";
import CourseCard from "@/components/CourseCard";
import ViewTimeTable from "@/components/timetable/ViewTimeTable";

const Landing = () => {
  return (
    <div className="w-full min-h-screen bg-[#CEE4E5] font-poppins flex flex-col items-center justify-center overflow-x-hidden">
      <Header />

      <Navbar page="landing" loggedin={false} />

      <div className="relative w-full flex justify-center items-center px-4 sm:px-6 lg:px-12 py-8">
        <Image
          src="/art/letter_i.svg"
          alt="I"
          width={48}
          height={48}
          className="absolute left-[2%] top-10 z-10 w-6 sm:w-8 md:w-10 lg:w-12 select-none"
        />
        <Image
          src="/art/letter_k.svg"
          alt="K"
          width={48}
          height={48}
          className="absolute right-[2%] top-40 z-10 w-6 sm:w-8 md:w-10 lg:w-12 select-none"
        />
        <Image
          src="/art/letter_m.svg"
          alt="M"
          width={48}
          height={48}
          className="absolute bottom-24 left-[5%] z-10 w-6 sm:w-8 md:w-10 lg:w-12 select-none"
        />

        <div className="max-w-6xl">
          <FacultySelector
            domains={[]}
            subjects={[]}
            slots={[]}
            faculties={["a", "b", "c"]}
            onConfirm={() => { }}
            onReset={() => { }}
          />
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-12">
        <CourseCard />
      </div>

      {/* Full width ViewTimeTable container */}
      <div className="w-screen p-0 m-0">
        <ViewTimeTable />
      </div>

      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-12 m-32">
        <Image
          src="/art/graphic.svg"
          alt="footer wave"
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

export default Landing;
