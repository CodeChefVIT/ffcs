"use client";

import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/components/ui/Footer";
import Accordion from "@/components/ui/Accordion";

import { ZButton } from "@/components/ui/Buttons";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { PopupLogin } from "@/components/ui/PopupMobile";

export default function View() {
  const router = useRouter();
  const { data: session } = useSession();
  const loggedin = !!session;
  const [showLoginPopupSaved, setShowLoginPopupSaved] = useState(false);

  return (
    <>
      {showLoginPopupSaved && (
        <PopupLogin
          closeLink={() => setShowLoginPopupSaved(false)}
          onLoginClick={() =>
            signIn("google", { callbackUrl: "/saved", redirect: true })
          }
        />
      )}

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

        <div className="flex-grow mt-16 flex flex-col items-center text-center relative">
          <div className="text-5xl mb-2 font-pangolin text-black">
            FFCS-inator
          </div>
          <div className="text-2xl mb-8 font-pangolin text-black">
            By CodeChef-VIT
          </div>

          <div className="mb-8">
            <Image
              src="/logo_ffcs.svg"
              alt="FFCS Logo"
              width={120}
              height={120}
              className="select-none"
              unselectable="on"
              draggable={false}
              priority
            />
          </div>

          <div className="text-4xl mb-8 font-pangolin text-black">
            Create Your
            <br />
            Ideal Timetable!
          </div>

          <div className="text-xl mb-8 font-poppins text-black">
            Use PC or Tablet For All Features
          </div>
          <ZButton
            type="regular"
            text="Saved Timetables"
            color="green"
            onClick={
              loggedin
                ? () => router.push("/saved")
                : () => setShowLoginPopupSaved(true)
            }
          />
        </div>

        <div className="h-6" />

        <Accordion />

        <Footer type="mobile" />
      </div>
    </>
  );
}
