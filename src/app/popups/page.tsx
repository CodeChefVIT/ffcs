"use client";

import { useState } from "react";
import { RegularButton } from "@/components/ui/Buttons";
import Popup from "@/components/ui/popup";

type PopupType = | "google" | "email" | "remove" | "save" | "share" | "delete" | "view" | "shared" | null;

export default function Home() {
  const [popupType, setPopupType] = useState<PopupType>(null);
  const closePopup = () => setPopupType(null);

  const getPopupComponent = (type: PopupType) => {
    switch (type) {
      case "google":
        return <Popup type="login" closeLink={closePopup} action={closePopup} />;
      case "remove":
        return <Popup type="rem_course" closeLink={closePopup} action={closePopup} dataBody="Engineering Rizzology" />;
      case "email":
        return <Popup type="email_tt" closeLink={closePopup} />;
      case "share":
        return <Popup type="share_tt" closeLink={closePopup} dataBody="ffcs.codechefvit.com/share?id=ABC123" />;
      case "save":
        return <Popup type="save_tt" closeLink={closePopup} action={closePopup} />;
      case "delete":
        return <Popup type="delete_tt" closeLink={closePopup} action={closePopup} dataBody="Morning Theory" />;
      case "view":
        return <Popup type="view_tt" closeLink={closePopup} action={closePopup} dataBody="ffcs.codechefvit.com/share?id=ABC123" dataTitle="Morning Theory" dataTT={[]} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 p-8">
        <RegularButton text="Google" color="yellow" onClick={() => setPopupType("google")} />
        <RegularButton text="Email" color="purple" onClick={() => setPopupType("email")} />
        <RegularButton text="Remove" color="red" onClick={() => setPopupType("remove")} />
        <RegularButton text="Save" color="green" onClick={() => setPopupType("save")} />
        <RegularButton text="Share" color="blue" onClick={() => setPopupType("share")} />
        <RegularButton text="Delete" color="red" onClick={() => setPopupType("delete")} />
        <RegularButton text="View" color="blue" onClick={() => setPopupType("view")} />
      </div>
      {getPopupComponent(popupType)}
    </div>
  );
}
