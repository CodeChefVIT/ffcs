'use client';

import React from 'react';
import Image from 'next/image';
import CompoundTable from './CompoundTable';
import Footer from './Footer';
import { GoogleLoginButton, BasicToggleButton, ZButton } from './Buttons';
//import QRCode from './QRCode';

type dataProps = {
  code: string;
  slot: string;
  name: string;
};

type PopupViewTTProps = {
  TTName: string;
  TTData: dataProps[];
  closeLink: () => void;
  onShareClick: () => Promise<void>;
  shareEnabledDefault: boolean;
  shareSwitchAction: (state: 'on' | 'off') => Promise<void>;
  shareLink: string;
};

type PopupLoginProps = {
  closeLink: () => void;
  onLoginClick: () => void;
};

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
            unselectable="on"
            draggable={false}
          />
        </div>

        <div className="w-full p-2">
          <ZButton type="regular" text="Go Back" color="red" onClick={closeLink} />
        </div>

        <div className="flex-grow mt-4 flex flex-col items-center text-center relative">
          <div className="text-5xl mb-2 font-pangolin text-black">FFCS-inator</div>
          <div className="text-2xl mb-8 font-pangolin text-black">By CodeChef-VIT</div>

          <div className="mb-8">
            <Image
              src="/logo_ffcs.svg"
              alt="FFCS Logo"
              width={120}
              height={120}
              unselectable="on"
              draggable={false}
              priority
            />
          </div>

          <div className="text-2xl mb-8 font-poppins text-black">
            Please log-in to save and
            <br />
            share your timetables
          </div>

          <div className="flex flex-col items-center justify-center relative mt-8 mb-4">
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

export function PopupViewTT({
  TTName,
  TTData,
  closeLink,
  onShareClick,
  shareEnabledDefault,
  shareSwitchAction,
  shareLink,
}: PopupViewTTProps) {
  return (
    // Outer: fixed full-screen, scrollable vertically, clips horizontal overflow
    <div className="fixed inset-0 z-50 overflow-y-hidden overflow-x-hidden bg-white">
      <div className="flex flex-col min-h-screen w-full relative items-center font-poppins">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-[#CEE4E5]">
          <Image
            src="/art/bg_dots.svg"
            alt="Background"
            fill
            priority
            sizes="100vw"
            className="object-top object-contain w-full h-full"
            unselectable="on"
            draggable={false}
          />
        </div>

        {/* Back button — pinned to left edge */}
        <div className="w-full p-2">
          <ZButton type="regular" text="Go Back" color="red" onClick={closeLink} />
        </div>

        {/* Title */}
        <div className="text-2xl mt-4 mb-4 text-black font-semibold font-poppins px-4 text-center">
          {TTName}
        </div>

        {/* Share controls */}
        <div className="w-full px-4 flex flex-col items-center gap-3 mb-4">
          {shareEnabledDefault && shareLink && <QRCode url={shareLink} />}

          {shareLink && (
            <div className="text-center text-xs text-gray-700 w-full break-all">
              <span className="font-medium">Shareable Link: </span>
              <span className="underline">{shareLink}</span>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            {shareEnabledDefault ? 'Publicly Shareable' : 'Private'}
          </div>

          <div className="flex flex-col items-center gap-3">
            <ZButton
              type="regular"
              text="Copy Share Link"
              color="green"
              image="/icons/send.svg"
              forceColor="#C1FF83"
              onClick={onShareClick}
            />
            <BasicToggleButton
              defaultState={shareEnabledDefault ? 'on' : 'off'}
              onToggle={shareSwitchAction}
            />
          </div>
        </div>

        {/* Timetable — scrolls horizontally within its own box */}
        <div className="w-full overflow-x-auto mb-8 px-2">
          <CompoundTable data={TTData} />
        </div>

        <Footer type="mobile" />
      </div>
    </div>
  );
}
