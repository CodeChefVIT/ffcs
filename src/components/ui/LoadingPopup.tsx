"use client";

import React from "react";

export default function LoadingPopup({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#425D5F]/75 backdrop-blur-xs select-none">
      <div className="inline-flex flex-col rounded-3xl outline-4 outline-black shadow-[10px_10px_0_0_black] box-border items-center justify-center h-48 w-48 bg-[#A7D5D7]">
        <div
          className="w-16 h-16 animate-spin rounded-full mx-auto"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, rgba(0,0,0,0), rgba(0,0,0,0.5))",
            WebkitMaskImage:
              "radial-gradient(circle, transparent 50%, black 51%)",
            maskImage: "radial-gradient(circle, transparent 50%, black 51%)",
          }}
        />
      </div>
    </div>
  );
}
