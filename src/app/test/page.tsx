"use client";

import Popup from "@/components/popups/popup";
import { RegularButton } from "@/components/ui/Buttons";
import { useState } from "react";

type PopupType = | "google" | "email" | "remove" | "save" | "share" | "delete" | "view" | "shared" | null;

export default function Home() {
  const [popupType, setPopupType] = useState<PopupType>(null);
  const closePopup = () => setPopupType(null);

  const getPopupComponent = (type: PopupType) => {
    switch (type) {
      case "google":
        return <Popup type="login" closeLink={closePopup} action1={closePopup} />;
      case "remove":
        return <Popup type="rem_course" dataBody="Engineering Rizzology" closeLink={closePopup} action1={closePopup} />;
      case "email":
        return <Popup type="email_tt" closeLink={closePopup} />;
      case "share":
        return <Popup type="share_tt" dataBody="ffcs.codechefvit.com/share?id=ABC123" closeLink={closePopup} />;
      case "save":
        return <Popup type="save_tt" closeLink={closePopup} action1={closePopup} />;
      case "delete":
        return <Popup type="delete_tt" dataBody="Morning Theory" closeLink={closePopup} action1={closePopup} />;
      case "view":
        return <Popup type="view_tt" closeLink={closePopup} />;
      case "shared":
        return <Popup type="shared_tt" closeLink={closePopup} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 p-8">
        <RegularButton text="Google" color="yellow" onClick={() => setPopupType("google")} />
        <RegularButton text="Email" color="blue" onClick={() => setPopupType("email")} />
        <RegularButton text="Remove" color="red" onClick={() => setPopupType("remove")} />
        <RegularButton text="Save" color="green" onClick={() => setPopupType("save")} />
        <RegularButton text="Share" color="yellow" onClick={() => setPopupType("share")} />
        <RegularButton text="Delete" color="red" onClick={() => setPopupType("delete")} />
        <RegularButton text="View" color="blue" onClick={() => setPopupType("view")} />
        <RegularButton text="Shared" color="purple" onClick={() => setPopupType("shared")} />
      </div>
      {getPopupComponent(popupType)}
    </div>
  );
}
