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

  return (
    <div className="">
    <div className="bg p-6 ml-8 flex items-center gap-8 " >
      <span className="text-black font-semibold text-[1.7rem]">Replace</span>

      <select
        value={fromSlot}
        onChange={(e) => setFromSlot(e.target.value)}
        className="rounded-lg border-2 border-black px-10 py-2 bg-white focus:outline-black text-[1.2rem]"
      >
        <option value="">Select Slot:</option>
        {slotOptions.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      <span className="text-black font-semibold text-[1.7rem]">with</span>

      <select
        value={toSlot}
        onChange={(e) => setToSlot(e.target.value)}
        className="rounded-lg border-2 border-black px-10 py-2 bg-white focus:outline-none text-[1.2rem]"
      >
        <option value="">Select Slot:</option>
        {slotOptions.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      <span className="text-black font-semibold text-[1.7rem]">Faculty:</span>

      <select
        value={faculty}
        onChange={(e) => setFaculty(e.target.value)}
        className="rounded-lg border-2 border-black px-15 py-2 bg-white focus:outline-none text-[1.2rem]"
      >
        <option value="">Select Faculty:</option>
        {facultyOptions.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <button
        onClick={handleModify}
        className="ml-8 px-6 py-2 bg-[#90BDFF] text-black font-semibold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:brightness-95 transition-all flex items-center gap-1 text-[1.2rem]"
      >
        Quick Modify
        <Image
          src="/Tool.svg"
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
