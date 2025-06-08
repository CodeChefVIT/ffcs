"use client";

import { useState } from "react";
import GoogleLoginPopup from "@/components/ui/login_popup";
import EmailLoginPopup from "@/components/ui/email_popup";

export default function Home() {
  const [popupType, setPopupType] = useState<"google" | "email" | null>(null);

  const closePopup = () => setPopupType(null);

  return (
    <div className="p-10">
      <button
        onClick={() => setPopupType("google")}
        className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
      >
        Gululu
      </button>

      <button 
      onClick={() => setPopupType("email")}
      className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5">
        Email
      </button>

      <button className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5">
        Main report
      </button>

     {popupType === "google" && <GoogleLoginPopup onClose={closePopup} />}
      {popupType === "email" && <EmailLoginPopup onClose={closePopup} />}
    </div>
  );
}
