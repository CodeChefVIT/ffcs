"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import CompoundTable from "@/components/ui/CompoundTable";
import Footer from "@/components/ui/Footer";
import { useSession, signIn } from "next-auth/react";
import { ZButton } from "@/components/ui/Buttons";
import Popup from "@/components/ui/Popup";
import AlertModal from "@/components/ui/AlertModal";
import LoadingPopup from "@/components/ui/LoadingPopup";

type dataProps = {
  code: string;
  slot: string;
  name: string;
};

export default function SharedTimetablePageMobile() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const loggedIn = !!session?.user?.email;
  const userEmail = session?.user?.email;
  const shareId =
    typeof params.shareId === "string"
      ? params.shareId
      : Array.isArray(params.shareId)
      ? params.shareId[0]
      : undefined;

  const [data, setData] = useState<dataProps[] | null>(null);
  const [title, setTitle] = useState<string>("");
  const [notFound, setNotFound] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [saveTTName, setSaveTTName] = useState<string>("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!shareId) return;
    axios
      .get(`/api/shared-timetable/${shareId}`)
      .then((res) => {
        const json = res.data;
        if (json && json.timetable && Array.isArray(json.timetable.slots)) {
          setTitle(json.timetable.title || "");
          setData(
            json.timetable.slots.map(
              (item: {
                courseCode: string;
                slot: string;
                facultyName: string;
              }): dataProps => ({
                code: item.courseCode,
                slot: item.slot,
                name: item.facultyName,
              })
            )
          );
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [shareId]);

  if (notFound) {
    router.push("/404");
  }

  function showAlert(msg: string) {
    setAlertMsg(msg);
    setAlertOpen(true);
  }

  async function handleSave() {
    if (!data || data.length === 0) {
      showAlert("No timetable to save.");
      return;
    }
    if (!userEmail) {
      setShowLoginPopup(true);
      return;
    }
    setIsSaving(true);
    try {
      const slots = data.map((item) => ({
        slot: item.slot,
        courseCode: item.code,
        courseName: item.code,
        facultyName: item.name,
      }));
      const res = await axios.post("/api/save-timetable", {
        title: saveTTName || title || "Saved Timetable",
        slots,
        owner: userEmail,
      });
      if (res.data.success) {
        showAlert("Timetable saved!");
      } else {
        showAlert("Failed to save timetable.");
      }
    } catch {
      showAlert("Error saving timetable.");
    } finally {
      setIsSaving(false);
      setShowSavePopup(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen relative items-center font-poppins">
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

      <div onClick={() => router.push("/")}>
        <Image
          src="/logo_ffcs.svg"
          alt="FFCS Logo"
          width={60}
          height={60}
          className="cursor-pointer mt-8 mb-8"
          unselectable="on"
          draggable={false}
          priority
        />
      </div>

      <div className="text-4xl mb-8 text-black font-pangolin">
        {title ? title : "Shared Timetable"}
      </div>
      {data && (
        <>
          <div className="w-full max-w-7xl overflow-x-auto mb-4">
            <CompoundTable data={data} />
          </div>
          <div className="mt-2 mb-4 flex justify-center">
            <ZButton
              type="long"
              text="Save"
              color="purple"
              image="/icons/save.svg"
              onClick={() => {
                if (!loggedIn) {
                  setShowLoginPopup(true);
                } else {
                  setSaveTTName(title || "Shared Timetable");
                  setShowSavePopup(true);
                }
              }}
            />
          </div>
        </>
      )}

      <Footer type="mobile" />
      {isSaving && <LoadingPopup isLoading={isSaving} />}

      {showSavePopup && (
        <Popup
          type="save_tt"
          dataBody={saveTTName}
          closeLink={() => setShowSavePopup(false)}
          action={handleSave}
          onInputChange={setSaveTTName}
        />
      )}
      {showLoginPopup && (
        <Popup
          type="login"
          closeLink={() => setShowLoginPopup(false)}
          action={() => signIn("google", { callbackUrl: "/", redirect: true })}
        />
      )}
      <AlertModal
        open={alertOpen}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
        color="purple"
      />
    </div>
  );
}
