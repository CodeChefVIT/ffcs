"use client";

import Image from "next/image";
import React from "react";
import { GoogleLoginButton, RegularButton } from "../ui/Buttons";
import { tableFacingSlot } from "@/lib/type";

type PopupProps = {
  type: 'login' | 'rem_course' | 'email_tt' | 'share_tt' | 'save_tt' | 'delete_tt' | 'view_tt' | 'shared_tt';
  dataTitle?: string;
  dataBody?: string;
  dataTT?: tableFacingSlot[];
  closeLink: () => void;
  action1?: () => void;
  action2?: () => void;
};

const colorMap = {
  red: ['#FFD3D3', '#FF8C8C'],
  yellow: ['#F9F7E2', '#FFBB39'],
  green: ['#E5FFDE', '#ABDE9F'],
  blue: ['#E2F2F9', '#8BD5FF'],
  purple: ['#E4E9FC', '#94ACFF'],
};

const typeColorMap = {
  login: 'yellow',
  rem_course: 'red',
  email_tt: 'blue',
  share_tt: 'yellow',
  save_tt: 'green',
  delete_tt: 'red',
  view_tt: 'blue',
  shared_tt: 'purple',
};

const typeTitleMap = {
  login: 'Sign In',
  rem_course: 'Remove Course',
  email_tt: 'Email Report',
  share_tt: 'Share Timetable',
  save_tt: 'Save Timetable',
  delete_tt: 'Delete Timetable',
  view_tt: '',
  shared_tt: '',
};

const typeTextMap = {
  login: 'Please log-in to save and share your time-tables.',
  rem_course: 'Are you sure you want to remove this course?',
  email_tt: 'A Report has been sent to your email ID.',
  share_tt: 'Use this link to share your timetable with anyone.',
  save_tt: 'This will be saved to your collection. Please enter a unique name.',
  delete_tt: 'Are you sure you want to delete this timetable?',
  view_tt: 'View Timetable',
  shared_tt: 'Shared Timetable',
};

export default function Popup({ type, dataTitle, dataBody, dataTT, closeLink, action1, action2 }: PopupProps) {

  const theme = colorMap[typeColorMap[type] as keyof typeof colorMap] || ['#E4E9FC', '#94ACFF'];
  const title = typeTitleMap[type] || dataTitle || 'Popup Title';
  const text = typeTextMap[type] || 'This is a generic popup message.';

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
              {[...Array(3)].map((_, i) => (<div key={i} className="w-4 h-4 rounded-full bg-black opacity-50" />))}
            </div>
          </div>

          {/* popup title */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center flex items-center justify-center font-poppins font-bold text-2xl">
            {title}
          </div>

          {/* close button */}
          {(!(type == 'delete_tt' || type == 'rem_course')) && (
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
                <Image src="/icons/cross.svg" alt="close" width={32} height={32} />
              </div>
            </div>
          )}

        </div>

        <div className="flex flex-col items-center justify-center text-lg font-poppins font-regular p-8">

          <div className="break-words max-w-lg w-full text-center mt-4 mb-8">
            {text}<br />
            {dataBody && <span className="font-semibold">"{dataBody}"</span>}
          </div>


          {(type == 'login') && (
            <div>
              <GoogleLoginButton />
              <div className="mt-8" />
            </div>
          )}

          {(type == 'rem_course') && (
            <div className="flex flex-row items-center justify-center gap-4 mb-4">
              <RegularButton text="Cancel" color="yellow" forceColor="#FFEA79" onClick={() => closeLink()} />
              <RegularButton text="Remove" color="red" forceColor={theme[1]} />
            </div>
          )}



        </div>

      </div>

    </div>

  );
};
