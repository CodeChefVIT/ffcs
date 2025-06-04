"use client";

import { useState } from "react";
import GoogleLoginPopup from "@/components/ui/login_popup"; // Adjust path if needed

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="p-10">
      <button
        onClick={() => setShowPopup(true)}
        className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
      >
        Gululu
      </button>

      <button className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5">
        Remove
      </button>

      <button className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5">
        Main report
      </button>

      {showPopup && <GoogleLoginPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
