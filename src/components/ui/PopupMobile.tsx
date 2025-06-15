"use client";

import Image from "next/image";
import React from "react";
import CompoundTable from "./CompoundTable";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { GoogleLoginButton, ZButton } from "./Buttons";

type dataProps = {
  code: string;
  slot: string;
  name: string;
}

type PopupViewTTProps = {
  TTName: string;
  TTData: dataProps[];
  shareLink: string;
  closeLink: () => void;
  onDownloadClick: () => void;
};

type PopupLoginProps = {
  closeLink: () => void;
  onLoginClick: () => void;
};

function copy(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(String(text));
  }
}


export function PopupLogin({ closeLink, onLoginClick }: PopupLoginProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="flex flex-col min-h-screen relative select-none">
        <div className="absolute inset-0 -z-10 bg-[#CEE4E5]">
          <Image
            src="/art/bg_dots.svg"
            alt="Background"
            fill
            priority
            sizes="100vw"
            className="object-top object-contain w-full h-full"
          />
        </div>

        <div className="w-full p-2">
          <ZButton type="regular" text="Go Back" color="red" onClick={closeLink} />
        </div>


        <div className="flex-grow mt-4 flex flex-col items-center text-center relative">

          <div className="text-5xl mb-2 font-pangolin text-black">
            FFCS-inator
          </div>

          <div className="text-2xl mb-8 font-pangolin text-black">
            By CodeChef-VIT
          </div>

          <div className="mb-8">
            <Image src="/logo_ffcs.svg" alt="FFCS Logo" width={120} height={120} />
          </div>

          <div className="text-2xl mb-8 font-poppins text-black">
            Please log-in to save and<br />
            share your timetables
          </div>

          <div className="flex flex-col items-center justify-center relative mt-8 mb-4">
            {/* Top-left */}
            <div className="absolute -top-7 -left-11 rotate-[-5deg] z-[1]">
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
            {/* Top-right */}
            <div className="absolute -top-7 -right-11 rotate-[-15deg] z-[1]">
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
            {/* Bottom-left */}
            <div className="absolute -bottom-4 -left-15 rotate-[-25deg] z-[1]">
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
            {/* Bottom-right */}
            <div className="absolute -bottom-5 -right-15 rotate-[17deg] z-[1]">
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
            <GoogleLoginButton onClick={onLoginClick} />
            <div className="mt-8" />
          </div>
        </div>

        <div className="h-6" />

        <Footer type="mobile" />
      </div>
    </div>
  );
}

export function PopupViewTT({ TTName, TTData, shareLink, closeLink, onDownloadClick }: PopupViewTTProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="flex flex-col min-h-screen relative items-center font-poppins">
        <div className="absolute inset-0 -z-10 bg-[#CEE4E5]">
          <Image
            src="/art/bg_dots.svg"
            alt="Background"
            fill
            priority
            sizes="100vw"
            className="object-top object-contain w-full h-full"
          />
        </div>

        <div className="w-full p-2">
          <ZButton type="regular" text="Go Back" color="red" onClick={closeLink} />
        </div>

        <div className="text-2xl mt-4 mb-4 text-black font-semibold font-poppins">{TTName}</div>

        <div className="flex flex-row items-center justify-center gap-4 mb-4">
          <ZButton type="regular" text="Copy Link" color="green" image="/icons/send.svg" forceColor="#C1FF83" onClick={() => copy(shareLink)} />
          <ZButton type="regular" text="Download" color="yellow" image="/icons/download.svg" forceColor="#FFEA79" onClick={onDownloadClick} />
        </div>

        <div className="w-full max-w-7xl overflow-x-auto mb-8">
          <CompoundTable data={TTData} />
        </div>

        <Footer type="mobile" />

      </div>
    </div>
  );
}

export default { PopupLogin, PopupViewTT };
