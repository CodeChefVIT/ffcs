"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BasicToggleButton, GoogleLoginButton, ZButton } from "./Buttons";
import CompoundTable from "./CompoundTable";

type dataProps = {
  code: string;
  slot: string;
  name: string;
};

type PopupProps = {
  type:
    | "login"
    | "rem_course"
    | "share_tt"
    | "save_tt"
    | "delete_tt"
    | "view_tt"
    | "logout"
    | "rename_tt";
  dataTitle?: string;
  dataBody?: string;
  dataTT?: dataProps[];
  closeLink: () => void;
  action?: () => void;
  shareEnabledDefault?: boolean;
  shareSwitchAction?: (state: "on" | "off") => void;
  onInputChange?: (val: string) => void;
};

const colorMap = {
  red: ["#FFD3D3", "#FF8C8C"],
  yellow: ["#FFF8D1", "#FFEA79"],
  green: ["#E5FFDE", "#ABDE9F"],
  blue: ["#E2F2F9", "#8BD5FF"],
  purple: ["#E4E9FC", "#94ACFF"],
};

const typeColorMap = {
  login: "yellow",
  rem_course: "red",
  share_tt: "blue",
  save_tt: "green",
  delete_tt: "red",
  view_tt: "blue",
  logout: "red",
  rename_tt: "purple",
};

const typeTitleMap = {
  login: "Sign In",
  rem_course: "Remove Course",
  share_tt: "Share Timetable",
  save_tt: "Save Timetable",
  delete_tt: "Delete Timetable",
  view_tt: "",
  logout: "Log Out",
  rename_tt: "Rename Timetable",
};

const typeTextMap = {
  login: "Please log-in to save and share your time-tables.",
  rem_course: "Are you sure you want to remove this course?",
  share_tt: "Share your timetable with anyone.",
  save_tt: "Save this timetable in your collection.",
  delete_tt: "Are you sure you want to delete this timetable?",
  view_tt: "",
  logout: "Are you sure you want to log out?",
  rename_tt: "Enter a new name for your timetable.",
};

function copy(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(String(text));
  }
}

export default function Popup({
  type,
  dataTitle,
  dataBody,
  dataTT,
  closeLink,
  action,
  shareEnabledDefault,
  shareSwitchAction,
  onInputChange,
}: PopupProps) {
  const theme = colorMap[typeColorMap[type] as keyof typeof colorMap] || [
    "#E4E9FC",
    "#94ACFF",
  ];
  const title = typeTitleMap[type] || dataTitle || "";
  const text = typeTextMap[type] || "";

  const shareEnabled =
    shareEnabledDefault !== undefined ? shareEnabledDefault : true;
  const [shareState, setShareState] = useState<"on" | "off">(
    shareEnabled ? "on" : "off"
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#425D5F]/75 backdrop-blur-xs z-50 select-none">
      <div
        style={{ backgroundColor: theme[0] }}
        className={`
        inline-flex flex-col
        rounded-3xl
        mb-8 mt-0
        outline-4 outline-black
        shadow-[10px_10px_0_0_black]
        box-border
        items-stretch
        max-w-[80vw] max-h-[80vh]
        min-w-120 min-h-48
      `}
      >
        <div
          style={{ backgroundColor: theme[1] }}
          className={`
          rounded-t-3xl
          flex items-center
          text-lg
          font-semibold
          outline-4 outline-black
          justify-between
          relative
          pl-2
          h-12
        `}
        >
          {/* 3 circles */}
          <div className="flex-1 text-left flex items-center justify-start pl-4">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full bg-black opacity-50"
                />
              ))}
            </div>
          </div>

          {/* popup title */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center flex items-center justify-center font-poppins font-bold text-2xl">
            {title}
          </div>

          {/* close button */}
          {!(
            type == "delete_tt" ||
            type == "rem_course" ||
            type == "logout"
          ) && (
            <div className="flex-1 text-right flex items-center justify-end">
              <div
                className={`
                w-12 h-12
                bg-[#FF9A9A]
                rounded-tr-3xl
                flex items-center
                justify-center
                cursor-pointer
                outline-4 outline-black
                pt-1 pr-1
              `}
                onClick={() => closeLink()}
              >
                <Image
                  src="/icons/cross.svg"
                  alt="close"
                  width={32}
                  height={32}
                  draggable={false}
                  unselectable="on"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center text-lg font-poppins font-regular p-8">
          {type == "login" && (
            <div className="flex flex-col items-center justify-center relative">
              <div className="absolute -top-0 -left-12 -rotate-[5deg] z-[1]">
                <Image
                  src="/art/art_rice.svg"
                  alt="artwork1"
                  width={32}
                  height={32}
                  className="select-none"
                  unselectable="on"
                  draggable={false}
                  priority
                />
              </div>
              <div className="absolute top-1 -right-10 rotate-[-0deg] z-[1]">
                <Image
                  src="/art/art_boom.svg"
                  alt="artwork2"
                  width={36}
                  height={36}
                  className="select-none"
                  unselectable="on"
                  draggable={false}
                  priority
                />
              </div>
              <div className="absolute -bottom-1 -left-10 -rotate-[5deg] z-[1]">
                <Image
                  src="/art/art_arrow.svg"
                  alt="artwork3"
                  width={72}
                  height={72}
                  className="select-none"
                  unselectable="on"
                  draggable={false}
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-7 rotate-[5deg] z-[1]">
                <Image
                  src="/art/art_loop.svg"
                  alt="artwork4"
                  width={60}
                  height={60}
                  className="select-none"
                  unselectable="on"
                  draggable={false}
                  priority
                />
              </div>
              <div className="break-words max-w-xs w-full text-center mt-4 mb-8 z-10">
                {text}
              </div>
              <GoogleLoginButton onClick={action} />
              <div className="mt-8" />
            </div>
          )}

          {type == "share_tt" && (
            <div className="flex flex-col items-center justify-center">
              <div className="break-words w-full text-center mt-2 mb-4">
                {text}
              </div>

              {shareState === "on" && (
                <div className="flex flex-row items-center justify-center gap-8 mt-2 mb-4">
                  <div className="border-3 border-black pt-2 pb-2 px-4 rounded-xl shadow-[4px_4px_0_0_black] bg-white text-[#606060] font-semibold">
                    {dataBody}
                  </div>
                  <ZButton
                    type="regular"
                    text="Copy"
                    color="blue"
                    forceColor={theme[1]}
                    onClick={() => copy(dataBody || "")}
                  />
                </div>
              )}

              <div className="flex flex-row items-center justify-center gap-4 mt-4 mb-4">
                <div
                  className={`
                  ${shareState === "on" ? "text-[#0E595D]" : "text-[#661800]"}
                  text-xl
                  font-semibold
                  mt-2 mb-2
                `}
                >
                  Sharing Link is {shareState === "on" ? "Public" : "Private"}
                </div>
                <BasicToggleButton
                  defaultState={shareState}
                  onToggle={(state: "on" | "off") => {
                    setShareState(state);
                    if (shareSwitchAction) shareSwitchAction(state);
                    else alert("No action provided for share switch toggle.");
                  }}
                />
              </div>
            </div>
          )}

          {type == "rem_course" && (
            <div>
              <div className="break-words max-w-lg w-full text-center mt-2 mb-8">
                {text}
                <br />
                {dataBody && (
                  <span className="font-semibold">&quot;{dataBody}&quot;</span>
                )}
              </div>
              <div className="flex flex-row items-center justify-center gap-4 mb-4">
                <ZButton
                  type="regular"
                  text="Cancel"
                  color="yellow"
                  forceColor="#FFEA79"
                  onClick={closeLink}
                />
                <ZButton
                  type="regular"
                  text="Remove"
                  color="red"
                  forceColor={theme[1]}
                  onClick={action}
                />
              </div>
            </div>
          )}

          {type == "delete_tt" && (
            <div>
              <div className="break-words max-w-lg w-full text-center mt-2 mb-8">
                {text}
                <br />
                {dataBody && (
                  <span className="font-semibold">&quot;{dataBody}&quot;</span>
                )}
              </div>
              <div className="flex flex-row items-center justify-center gap-4 mb-4">
                <ZButton
                  type="regular"
                  text="Cancel"
                  color="yellow"
                  forceColor="#FFEA79"
                  onClick={closeLink}
                />
                <ZButton
                  type="regular"
                  text="Delete"
                  color="red"
                  forceColor={theme[1]}
                  onClick={action}
                />
              </div>
            </div>
          )}

          {type == "save_tt" && (
            <div>
              <div className="break-words max-w-lg w-full text-center mt-2 mb-8">
                {text}
              </div>
              <div className="flex flex-row items-center justify-center gap-8 mt-2 mb-4">
                <div className="border-3 border-black pt-2 pb-2 px-4 rounded-xl shadow-[4px_4px_0_0_black] bg-white text-black font-semibold">
                  <input
                    type="text"
                    className="bg-transparent outline-none w-full text-center font-semibold"
                    placeholder="Enter timetable name"
                    value={dataBody}
                    onChange={(e) =>
                      onInputChange && onInputChange(e.target.value)
                    }
                  />
                </div>
                <ZButton
                  type="regular"
                  text="Save"
                  color="green"
                  forceColor={theme[1]}
                  onClick={action}
                />
              </div>
            </div>
          )}

          {type == "rename_tt" && (
            <div>
              <div className="break-words max-w-lg w-full text-center mt-2 mb-8">
                {text}
              </div>
              <div className="flex flex-row items-center justify-center gap-8 mt-2 mb-4">
                <div className="border-3 border-black pt-2 pb-2 px-4 rounded-xl shadow-[4px_4px_0_0_black] bg-white text-black font-semibold">
                  <input
                    type="text"
                    className="bg-transparent outline-none w-full text-center font-semibold"
                    placeholder="Enter timetable name"
                    value={dataBody}
                    onChange={(e) =>
                      onInputChange && onInputChange(e.target.value)
                    }
                    autoFocus
                  />
                </div>
                <ZButton
                  type="regular"
                  text="Save"
                  color="green"
                  forceColor={theme[1]}
                  onClick={action}
                />
              </div>
            </div>
          )}

          {type == "view_tt" && (
            <div className="flex flex-col w-full max-h-[90vh] overflow-hidden">
              {/* Scrollable area only if needed */}
              <div className="overflow-auto w-full max-h-[calc(70vh-80px)]">
                <div className="min-w-[768px] text-center p-4">
                  <CompoundTable data={dataTT || []} />
                </div>
              </div>

              {/* Bottom controls - always visible */}
              <div className="flex flex-row flex-wrap items-center justify-center gap-16 px-4 py-3">
                <div className="flex flex-row items-center gap-3">
                  <ZButton
                    type="regular"
                    text="Copy Link"
                    color="green"
                    image="/icons/send.svg"
                    forceColor="#C1FF83"
                    onClick={action}
                  />
                </div>

                <div className="flex flex-row items-center gap-4">
                  <span className="font-semibold text-lg">Public Sharing</span>
                  <BasicToggleButton
                    key={shareEnabledDefault ? "on" : "off"}
                    defaultState={shareEnabledDefault ? "on" : "off"}
                    onToggle={shareSwitchAction ?? (() => {})}
                  />
                </div>
              </div>
            </div>
          )}

          {type === "logout" && (
            <div>
              <div className="break-words max-w-lg w-full text-center mt-2 mb-8">
                {text}
              </div>
              <div className="flex flex-row items-center justify-center gap-4 mb-4">
                <ZButton
                  type="regular"
                  text="Cancel"
                  color="yellow"
                  forceColor="#FFEA79"
                  onClick={closeLink}
                />
                <ZButton
                  type="regular"
                  text="Logout"
                  color="red"
                  forceColor={theme[1]}
                  onClick={action}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
