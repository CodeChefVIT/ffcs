"use client";

import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#CEE4E5]">
      <div className="text-4xl mb-8 font-pangolin text-[#00000088]">
        Loading
      </div>
      <div
        className="w-16 h-16 animate-spin rounded-full"
        style={{
          backgroundImage: 'conic-gradient(from 0deg, rgba(0,0,0,0), rgba(0,0,0,0.5))',
          WebkitMaskImage: 'radial-gradient(circle, transparent 50%, black 51%)',
          maskImage: 'radial-gradient(circle, transparent 50%, black 51%)',
        }}
      />
    </div>
  );
}
