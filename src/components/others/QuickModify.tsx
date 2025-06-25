"use client";

import React, { useState } from "react";
import Image from "next/image";

const ReplaceSlot = () => {
  const [fromSlot, setFromSlot] = useState("");
  const [toSlot, setToSlot] = useState("");
  const [faculty, setFaculty] = useState("");

  const slotOptions = ["A1", "B1", "C1", "D1"];
  const facultyOptions = ["Dr. Smith", "Prof. Mehta", "Ms. Rao"];

  const handleModify = () => {
    console.log("Replacing", fromSlot, "with", toSlot, "for", faculty);
  };

  const arrow = (
    <div className="pointer-events-none h-full w-8 border-l-2 border-black absolute right-0 top-0 flex items-center justify-center text-black text-[0.7rem]">
      ▼
    </div>
  );

  return (
    <div className="w-full flex items-center justify-center px-2">
      <div className="bg p-4 lg:p-6 w-full max-w-screen-xl flex flex-wrap lg:flex-nowrap items-center justify-center gap-3 lg:gap-8">
        <span className="text-black font-semibold text-[1.4rem] lg:text-[1.7rem] whitespace-nowrap">
          Replace
        </span>

        
        <div className="relative w-[45%] sm:w-[25%] lg:w-auto min-w-[100px]">
          <label htmlFor="fromSlot" className="sr-only">
            From Slot
          </label>
          <select
            id="fromSlot"
            value={fromSlot}
            onChange={(e) => setFromSlot(e.target.value)}
            className="w-full rounded-lg border-2 border-black px-6 py-2 pr-10 bg-white focus:outline-none text-[1.1rem] lg:text-[1.2rem] appearance-none"
          >
            <option value="">Select Slot:</option>
            {slotOptions.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {arrow}
        </div>

        <span className="text-black font-semibold text-[1.4rem] lg:text-[1.7rem] whitespace-nowrap">
          with
        </span>

        
        <div className="relative w-[45%] sm:w-[25%] lg:w-auto min-w-[100px]">
          <label htmlFor="toSlot" className="sr-only">
            To Slot
          </label>
          <select
            id="toSlot"
            value={toSlot}
            onChange={(e) => setToSlot(e.target.value)}
            className="w-full rounded-lg border-2 border-black px-6 py-2 pr-10 bg-white focus:outline-none text-[1.1rem] lg:text-[1.2rem] appearance-none"
          >
            <option value="">Select Slot:</option>
            {slotOptions.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {arrow}
        </div>

        <span className="text-black font-semibold text-[1.4rem] lg:text-[1.7rem] whitespace-nowrap">
          Faculty:
        </span>

        
        <div className="relative w-full sm:w-[30%] lg:w-auto min-w-[120px]">
          <label htmlFor="faculty" className="sr-only">
            Faculty
          </label>
          <select
            id="faculty"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full rounded-lg border-2 border-black px-6 py-2 pr-10 bg-white focus:outline-none text-[1.1rem] lg:text-[1.2rem] appearance-none"
          >
            <option value="">Select Faculty:</option>
            {facultyOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {arrow}
        </div>

        
        <button
          onClick={handleModify}
          className="w-full sm:w-auto px-5 py-2 bg-[#90BDFF] text-black font-semibold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:brightness-95 transition-all flex items-center justify-center gap-1 text-[1.1rem] lg:text-[1.2rem]"
        >
          Quick Modify
          <Image
            src="/icons/tool.svg"
            alt="quick modify icon"
            width={24}
            height={24}
            unselectable="on"
            draggable={false}
            priority
          />
        </button>
      </div>
    </div>
  );
};

export default ReplaceSlot;
