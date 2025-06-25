"use client";

import React, { useState } from "react";
import { CCButton, FFCSButton, ZButton } from "./Buttons";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Popup from "./Popup";

type NavbarProps = {
  page: "landing" | "404" | "slots" | "saved" | "shared" | "mobile" | "placeholder";
};

export default function Navbar({ page }: NavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const loggedin = !!session;
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showLoginPopupSaved, setShowLoginPopupSaved] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  let userName = "User";
  if (loggedin) {
    userName =
      (session?.user?.name ?? "").trim().split(" ").slice(0, -1).join(" ") || userName;
  }

  return (
    <>
      {showLoginPopup && (
        <Popup
          type="login"
          closeLink={() => setShowLoginPopup(false)}
          action={() => signIn("google", { callbackUrl: "/", redirect: true })}
        />
      )}
      {showLoginPopupSaved && (
        <Popup
          type="login"
          closeLink={() => setShowLoginPopupSaved(false)}
          action={() => signIn("google", { callbackUrl: "/saved", redirect: true })}
        />
      )}
      {showLogoutPopup && (
        <Popup
          type="logout"
          closeLink={() => setShowLogoutPopup(false)}
          action={() => signOut({ callbackUrl: "/" })}
        />
      )}

      <div className="absolute top-0 left-0 w-full z-10 select-none">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4 items-center">
            {(page === "landing" || page === "404" || page === "placeholder") && (
              <>
                <CCButton />
                <ZButton
                  type="long"
                  text="Slot View"
                  color="yellow"
                  onClick={() => router.push("/slots")}
                />
              </>
            )}

            {(page === "slots" || page === "saved" || page === "shared") && (
              <>
                <FFCSButton />
                <div
                  className="text-4xl font-[pangolin] cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  FFCS-inator
                </div>
              </>
            )}

            {page === "mobile" && (
              <div
                className="text-3xl font-[pangolin] cursor-pointer"
                onClick={() => router.push("/")}
              >
                FFCS-inator
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center">
            {(page === "landing" || page === "404" || page === "shared" || page === "slots") && (
              <ZButton
                type="long"
                text="Saved Timetables"
                color="blue"
                onClick={
                  loggedin ? () => router.push("/saved") : () => setShowLoginPopupSaved(true)
                }
              />
            )}

            {page === "saved" && (
              <ZButton
                type="long"
                text="Slot View"
                color="yellow"
                onClick={() => router.push("/slots")}
              />
            )}

            {(page === "landing" ||
              page === "404" ||
              page === "shared" ||
              page === "saved" ||
              page === "slots") &&
              (!loggedin ? (
                <ZButton
                  type="long"
                  text="Log In"
                  color="green"
                  onClick={() => setShowLoginPopup(true)}
                />
              ) : (
                <ZButton
                  type="long"
                  text={userName}
                  color="purple"
                  onClick={() => setShowLogoutPopup(true)}
                />
              ))}

            {page === "mobile" &&
              loggedin && (
                <ZButton
                  type="regular"
                  text="Log Out"
                  color="purple"
                  onClick={() => signOut({ callbackUrl: "/" })}
                />
              )}
          </div>
        </div>
      </div>
    </>
  );
}
