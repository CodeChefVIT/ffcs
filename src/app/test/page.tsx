"use client";

import { useState } from "react";
import GoogleLoginPopup from "@/components/popups/login_popup";
import EmailPopup from "@/components/popups/email_popup";
import RemovePopup from "@/components/popups/remove_popup";
import SavePopup from "@/components/popups/save_popup";
import RenamePopup from "@/components/popups/rename_popup";
import SharePopup from "@/components/popups/share_popup";
import DeletePopup from "@/components/popups/delete_popup";
import ViewTimetablePopup from "@/components/popups/view_timetable_popup";

import Popup from "@/components/popups/popup";

type PopupType =
  | "google"
  | "email"
  | "remove"
  | "save"
  | "rename"
  | "share"
  | "delete"
  | "view_timetable"
  | "google_2"
  | "email_2"
  | "remove_2"
  | "save_2"
  | "share_2"
  | "delete_2"
  | "view_timetable_2"
  | null;

export default function Home() {
  const [popupType, setPopupType] = useState<PopupType>(null);

  const closePopup = () => setPopupType(null);

  // Helper to map _2 popups to original popup components
  const getPopupComponent = (type: PopupType) => {
    switch (type) {
      case "delete":
        return <DeletePopup onClose={closePopup} />;
      case "share":
        return <SharePopup onClose={closePopup} />;
      case "rename":
        return <RenamePopup onClose={closePopup} />;
      case "save":
        return <SavePopup onClose={closePopup} />;
      case "remove":
        return <RemovePopup onClose={closePopup} />;
      case "google":
        return <GoogleLoginPopup onClose={closePopup} />;
      case "email":
        return <EmailPopup onClose={closePopup} />;
      case "view_timetable":
        return <ViewTimetablePopup onClose={closePopup} />;

      case "delete_2":
        return <Popup type="delete_tt" dataBody="Engineering Rizzology" closeLink={closePopup} />;
      case "share_2":
        return <Popup type="share_tt" dataBody="Engineering Rizzology" closeLink={closePopup} />;
      case "save_2":
        return <Popup type="save_tt" dataBody="Engineering Rizzology" closeLink={closePopup} />;
      case "remove_2":
        return <Popup type="rem_course" dataBody="Engineering Rizzology" closeLink={closePopup} />;
      case "google_2":
        return <Popup type="login" closeLink={closePopup} />;
      case "email_2":
        return <Popup type="email_tt" dataBody="Engineering Rizzology" closeLink={closePopup} />;
      case "view_timetable_2":
        return <Popup type="view_tt" dataBody="Engineering Rizzology" closeLink={closePopup} />;

      default:
        return null;
    }
  };

  return (
    <div className="p-10">
      {/* First row */}
      <div className="mb-5">
        <button
          onClick={() => setPopupType("google")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          Gululu
        </button>
        <button
          onClick={() => setPopupType("email")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          Email
        </button>
        <button
          onClick={() => setPopupType("remove")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          remove course
        </button>
        <button
          onClick={() => setPopupType("save")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          save
        </button>
        <button
          onClick={() => setPopupType("rename")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          rename
        </button>
        <button
          onClick={() => setPopupType("share")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          share
        </button>
        <button
          onClick={() => setPopupType("delete")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          Delete Timetable
        </button>
        <button
          onClick={() => setPopupType("view_timetable")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          View Timetable
        </button>
      </div>
      {/* Second row */}
      <div>
        <button
          onClick={() => setPopupType("google_2")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          Google_2
        </button>
        <button
          onClick={() => setPopupType("email_2")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          Email_2
        </button>
        <button
          onClick={() => setPopupType("remove_2")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          Rem_Course_2
        </button>
        <button
          onClick={() => setPopupType("save_2")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          Save_2
        </button>
        <button
          onClick={() => setPopupType("share_2")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          Share_2
        </button>
        <button
          onClick={() => setPopupType("delete_2")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          Delete_Timetable_2
        </button>
        <button
          onClick={() => setPopupType("view_timetable_2")}
          className="text-white bg-blue-700 hover:bg-blue-900 focus:outline-none text-sm rounded-lg px-5 py-2.5 mr-5"
        >
          View_Timetable_2
        </button>
      </div>
      {/* Popup rendering */}
      {getPopupComponent(popupType)}
    </div>
  );
}
