//

"use client";
import { useState } from "react";
import GoogleLoginPopup from "@/components/ui/popups/login_popup";
import EmailPopup from "@/components/ui/popups/email_popup";
import RemovePopup from "@/components/ui/popups/remove_popup";
import SavePopup from "@/components/ui/popups/save_popup";
import RenamePopup from "@/components/ui/popups/rename_popup";
import SharePopup from "@/components/ui/popups/share_popup";
import DeletePopup from "@/components/ui/popups/delete_popup";


export default function Home() {
  const [popupType, setPopupType] = useState<"google" | "email" | "remove" | "save" | "rename" | "share" | "delete" | null>(null);

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

      <button 
      onClick={() => setPopupType("remove")}
      className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5">
        remove course
      </button>

      <button 
      onClick={() => setPopupType("save")}
      className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5">
        save
      </button>

      <button 
      onClick={() => setPopupType("rename")}
      className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5">
        rename
      </button>

      <button 
      onClick={() => setPopupType("share")}
      className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5">
        share
      </button>

      <button 
      onClick={() => setPopupType("delete")}
      className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5">
        Delete Timetable
      </button>

    {popupType === "delete" && <DeletePopup onClose={closePopup} />}
     {popupType === "share" && <SharePopup onClose={closePopup} />}
     {popupType === "rename" && <RenamePopup onClose={closePopup} />}
     {popupType === "save" && <SavePopup onClose={closePopup} />}
     {popupType === "remove" && <RemovePopup onClose={closePopup} />}
     {popupType === "google" && <GoogleLoginPopup onClose={closePopup} />}
     {popupType === "email" && <EmailPopup onClose={closePopup} />}
    </div>
  );
}
