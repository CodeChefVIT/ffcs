"use client";

import React, { useState } from "react";
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

      <div className="relative w-full flex justify-center items-center">
        <Image
          src="/art/letter_i.svg"
          alt="E"
          width={32}
          height={32}
          className="absolute left-[2%] top-16 z-10 lg:w-11 select-none"
        />
        <Image
          src="/art/letter_k.svg"
          alt="F"
          width={32}
          height={32}
          className="absolute right-[2%] top-60 z-10 lg:w-11 select-none"
        />
        <Image
          src="/art/letter_m.svg"
          alt="C"
          width={32}
          height={32}
          className="absolute bottom-36 left-[5%] z-10 lg:w-11 select-none"
        />

        <FacultySelector
          domains={[]}
          subjects={[]}
          slots={[]}
          faculties={["a", "b", "c"]}
          onConfirm={() => { }}
          onReset={() => { }}
        />
      </div>

      <CourseCard />

      <div className="flex flex-col items-center justify-center w-full">
        <ViewTimeTable/>
      </div>
      <div className="w-[80%] my-16">
        <Image
          src="/art/graphic.svg"
          alt="footer wave"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full"
          priority
        />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
