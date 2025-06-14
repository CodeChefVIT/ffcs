"use client";

import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/ui//Navbar";
import { Footer } from "@/components/ui/Footer";

import FacultySelector from "@/components/FacultySelector";
import CourseCard from "@/components/CourseCard";
import ViewTimeTable from "@/components/timetable/ViewTimeTable";
import { ZButton } from "@/components/ui/Buttons";
import { TimetableProvider } from "@/components/timetable/TimeTableContext";

const Landing = () => {
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

      <div className="relative w-320 h-180 flex justify-center items-center font-pangolin text-black">
        <div className="absolute left-1/2 top-36 w-full transform -translate-x-1/2 flex flex-col items-center text-center align-center">
          <Image
            src="/logo_ffcs.svg"
            alt="I"
            width={96}
            height={96}
            className="mx-auto mb-6 select-none"
            unselectable="on"
            draggable={false}
            priority
          />
          <div className="text-6xl mb-6">FFCS-inator</div>
          <div className="text-md font-poppins font-semibold text-black mb-6">
            Generate priority-based timetables in seconds.
            <br />
            No more clashes, no more stress.
          </div>
          <div className="text-3xl mb-8">Create Your Ideal Timetable!</div>
          <ZButton
            type="large"
            text="Start"
            image="/icons/arrow_down.svg"
            color="purple"
            onClick={() => {
              const el = document.getElementById("start");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        </div>

        <div className="absolute top-115 left-80 rotate-[-60deg] z-[1]">
          <Image
            src="/art/art_rice.svg"
            alt="graphic element"
            width={72}
            height={72}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-50 right-90 rotate-[-15deg] z-[1]">
          <Image
            src="/art/art_boom.svg"
            alt="graphic element"
            width={72}
            height={72}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-50 left-40 rotate-[0deg] z-[1]">
          <Image
            src="/art/art_paper.svg"
            alt="graphic element"
            width={180}
            height={180}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-60 right-32 rotate-[3deg] z-[1]">
          <Image
            src="/art/art_plane.svg"
            alt="graphic element"
            width={220}
            height={220}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-130 left-37 rotate-[0deg] z-[1]">
          <Image
            src="/art/letter_c.svg"
            alt="graphic element"
            width={60}
            height={60}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-50 left-100 rotate-[8deg] z-[1]">
          <Image
            src="/art/letter_h.svg"
            alt="graphic element"
            width={60}
            height={60}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-107 right-70 rotate-[0deg] z-[1]">
          <Image
            src="/art/letter_e.svg"
            alt="graphic element"
            width={60}
            height={60}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-132 right-30 rotate-[0deg] z-[1]">
          <Image
            src="/art/letter_f.svg"
            alt="graphic element"
            width={60}
            height={60}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-220 left-8 rotate-[0deg] z-[1]">
          <Image
            src="/art/letter_i.svg"
            alt="graphic element"
            width={60}
            height={60}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-300 left-23 rotate-[0deg] z-[1]">
          <Image
            src="/art/letter_m.svg"
            alt="graphic element"
            width={60}
            height={60}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>

        <div className="absolute top-263 right-12 rotate-[0deg] z-[1]">
          <Image
            src="/art/letter_k.svg"
            alt="graphic element"
            width={60}
            height={60}
            className="select-none"
            unselectable="on"
            draggable={false}
            priority
          />
        </div>
      </div>

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
          onConfirm={() => {}}
          onReset={() => {}}
        />
      </div>
      <TimetableProvider>
        {" "}
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <CourseCard />
        </div>
        <div className="w-screen  p-0 m-0">
          <ViewTimeTable />
        </div>
      </TimetableProvider>

      <div className="w-full  max-w-5xl px-4 sm:px-6 lg:px-12 m-32">
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
