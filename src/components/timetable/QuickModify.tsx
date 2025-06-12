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
    // logic 
  };

  const arrow = (
    <div className="pointer-events-none h-full w-8 border-l-2 border-black absolute right-0 top-0 flex items-center justify-center text-black text-[0.7rem]">
      ▼
    </div>
  );

  return (
    <div className="">
      <div className="bg p-6 ml-8 flex items-center gap-8">
        <span className="text-black font-semibold text-[1.7rem]">Replace</span>

        <div className="relative">
          <select
            value={fromSlot}
            onChange={(e) => setFromSlot(e.target.value)}
            className="rounded-lg border-2 border-black px-8 py-2 pr-15 bg-white focus:outline-black text-[1.2rem] appearance-none"
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

        <span className="text-black font-semibold text-[1.7rem]">with</span>

        <div className="relative">
          <select
            value={toSlot}
            onChange={(e) => setToSlot(e.target.value)}
            className="rounded-lg border-2 border-black px-8 py-2 pr-15 bg-white focus:outline-none text-[1.2rem] appearance-none"
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

        <span className="text-black font-semibold text-[1.7rem]">Faculty:</span>

        <div className="relative">
          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="rounded-lg border-2 border-black px-12 py-2 pr-15 bg-white focus:outline-none text-[1.2rem] appearance-none"
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
          className="ml-8 px-6 py-2 bg-[#90BDFF] text-black font-semibold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:brightness-95 transition-all flex items-center gap-1 text-[1.2rem]"
        >
          Quick Modify
          <Image
            src="/icons/tool.svg"
            alt="quick modify icon"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
};

export default ReplaceSlot;
