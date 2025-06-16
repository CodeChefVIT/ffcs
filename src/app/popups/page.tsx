"use client";

import { useState } from "react";

import Popup from "@/components/ui/Popup";
import { PopupLogin, PopupViewTT } from "@/components/ui/PopupMobile";
import { ZButton } from "@/components/ui/Buttons";

type PopupType =
  | "google"
  | "email"
  | "remove"
  | "save"
  | "share"
  | "delete"
  | "view"
  | "phone1"
  | "phone2"
  | null;

const data = [
  { code: "BBRT101L", slot: "TG1", name: "Mansi Sharma" },
  { code: "BBRT101P", slot: "L21+L22", name: "Mansi Sharma" },
  { code: "BBIT101L", slot: "A1+TA1", name: "Samya Mehta" },
  { code: "BBIT101P", slot: "L31+L32", name: "Samya Mehta" },
  { code: "BERT101L", slot: "B1", name: "Yashita Puri" },
  { code: "BERT101P", slot: "L59+L60", name: "Yashita Puri" },
  { code: "BBRT101L", slot: "C1", name: "Kuriak Tom Jacob" },
  { code: "BBRT101P", slot: "L43+L44", name: "Kuriak Tom Jacob" },
  { code: "BBRT101L", slot: "D1", name: "Abhinav Pant" },
  { code: "BBRT101L", slot: "F1+TF1", name: "Ishan Jindal" },
  { code: "BBRT101P", slot: "L47+L48", name: "Ishan Jindal" },
];

const handleShareSwitchAction = (state: "on" | "off") => {
  if (state == "on") alert("yippee");
  else alert("oh no");
};

export default function Home() {
  const [popupType, setPopupType] = useState<PopupType>(null);
  const closePopup = () => setPopupType(null);

  const getPopupComponent = (type: PopupType) => {
    switch (type) {
      case "google":
        return (
          <Popup type="login" closeLink={closePopup} action={closePopup} />
        );
      case "remove":
        return (
          <Popup
            type="rem_course"
            closeLink={closePopup}
            action={closePopup}
            dataBody="Engineering Rizzology"
          />
        );
      case "email":
        return <Popup type="email_tt" closeLink={closePopup} />;
      case "share":
        return (
          <Popup
            type="share_tt"
            closeLink={closePopup}
            dataBody="ffcs.codechefvit.com/share?id=ABC123"
            shareEnabledDefault={false}
            shareSwitchAction={handleShareSwitchAction}
          />
        );
      case "save":
        return (
          <Popup type="save_tt" closeLink={closePopup} action={closePopup} />
        );
      case "delete":
        return (
          <Popup
            type="delete_tt"
            closeLink={closePopup}
            action={closePopup}
            dataBody="<TT Name>"
          />
        );
      case "view":
        return (
          <Popup
            type="view_tt"
            closeLink={closePopup}
            action={closePopup}
            dataBody="ffcs.codechefvit.com/share?id=ABC123"
            dataTitle="<TT Name>"
            dataTT={data}
          />
        );
      case "phone1":
        return (
          <PopupViewTT
            TTName={"Morning Theory"}
            TTData={data}
            shareLink={"ffcs.codechefvit.com/share?id=ABC123"}
            closeLink={closePopup}
            onDownloadClick={closePopup}
          />
        );
      case "phone2":
        return <PopupLogin closeLink={closePopup} onLoginClick={closePopup} />;

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center gap-2 mb-4 p-8 w-full">
        <ZButton
          type="regular"
          text="Google"
          color="yellow"
          onClick={() => setPopupType("google")}
        />
        <ZButton
          type="regular"
          text="Email"
          color="purple"
          onClick={() => setPopupType("email")}
        />
        <ZButton
          type="regular"
          text="Remove"
          color="red"
          onClick={() => setPopupType("remove")}
        />
        <ZButton
          type="regular"
          text="Save"
          color="green"
          onClick={() => setPopupType("save")}
        />
        <ZButton
          type="regular"
          text="Share"
          color="blue"
          onClick={() => setPopupType("share")}
        />
        <ZButton
          type="regular"
          text="Delete"
          color="red"
          onClick={() => setPopupType("delete")}
        />
        <ZButton
          type="regular"
          text="View"
          color="blue"
          onClick={() => setPopupType("view")}
        />
        <ZButton
          type="regular"
          text="View Mobile"
          color="purple"
          onClick={() => setPopupType("phone1")}
        />
        <ZButton
          type="regular"
          text="Login Mobile"
          color="purple"
          onClick={() => setPopupType("phone2")}
        />
      </div>
      {getPopupComponent(popupType)}
    </div>
  );
}
