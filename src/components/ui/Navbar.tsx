"use client";

import React from "react";
import { CCButton, FFCSButton, ZButton } from "./Buttons";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

type NavbarProps = {
  page: "landing" | "404" | "slots" | "saved" | "shared" | "mobile";
};

export default function Navbar({ page }: NavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const loggedin = !!session;

  return (
    <div className="absolute top-0 left-0 w-full z-10 select-none">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {/* B1: CC or FFCS button */}
          {(page == "landing" || page == "404" || page == "shared") && (
            <CCButton />
          )}
          {(page == "slots" || page == "saved") && <FFCSButton />}

          {/* B2: Slots or Text */}
          {(page == "landing" || page == "404" || page == "shared") && (
            <ZButton
              type="long"
              text="Slot View"
              color="yellow"
              onClick={() => router.push("/slots")}
            />
          )}
          {(page === "slots" || page === "saved") && (
            <div
              className="text-4xl font-[pangolin] cursor-pointer"
              onClick={() => router.push("/")}
            >
              FFCS-inator
            </div>
          )}

          {/* B3: Mobile */}
          {page == "mobile" && (
            <div
              className="text-3xl font-[pangolin] cursor-pointer"
              onClick={() => router.push("/")}
            >
              FFCS-inator
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {/* B4: Slots or Saved */}
          {(page === "landing" ||
            page === "404" ||
            page == "slots" ||
            page == "shared") && (
            <ZButton
              type="long"
              text="Saved Timetables"
              color="blue"
              onClick={() => router.push("/saved")}
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

          {/* B5: Login Logout */}
          {(page === "landing" || page === "404" || page == "slots") &&
            !loggedin && (
              <ZButton
                type="long"
                text="Log In"
                color="green"
                onClick={() => signIn("google")}
              />
            )}
          {(page === "saved" ||
            ((page === "landing" || page === "404" || page == "slots") &&
              loggedin)) && (
            <ZButton
              type="long"
              text="Log Out"
              color="red"
              onClick={() => signOut({ callbackUrl: "/" })}
            />
          )}

          {/* B6: Mobile */}
          {page == "mobile" && (
            <ZButton
              type="regular"
              text="Log Out"
              color="red"
              onClick={() => signOut({ callbackUrl: "/" })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
