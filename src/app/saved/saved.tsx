"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/Navbar";
import { ZButton } from "@/components/ui/Buttons";
import Footer from "@/components/ui/Footer";
import Popup from "@/components/ui/Popup";
import Image from "next/image";
import AlertModal from "@/components/ui/AlertModal";
import axios from "axios";
import Loader from "@/components/ui/Loader";

async function fetchTimetablesByOwner(owner: string) {
  const res = await axios.get(
    `/api/timetables?owner=${encodeURIComponent(owner)}`
  );
  return res.data;
}

interface TimetableEntry {
  _id: string;
  title: string;
  isPublic: boolean;
  shareId?: string;
  slots: {
    slot: string;
    courseCode: string;
    courseName: string;
    facultyName: string;
  }[];
}

type PopupSlot = {
  code: string;
  slot: string;
  name: string;
};


export default function Saved() {
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<
    "view_tt" | "delete_tt" | "rename_tt" | null
  >(null);
  const [popupSlots, setPopupSlots] = useState<PopupSlot[]>([]);
  const [popupTitle, setPopupTitle] = useState("");
  const [selectedTT, setSelectedTT] = useState<TimetableEntry | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [publicToggle, setPublicToggle] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    setLoading(true);
    fetchTimetablesByOwner(userEmail)
      .then(setTimetables)
      .catch(() => setTimetables([]))
      .finally(() => setLoading(false));
  }, [userEmail]);

  function convertSlots(slots: TimetableEntry["slots"]): PopupSlot[] {
    return slots.map((s) => ({
      code: s.courseCode,
      slot: s.slot,
      name: s.facultyName,
    }));
  }

  async function handleDelete() {
    if (!selectedTT) return;
    await axios.delete(`/api/timetables/${selectedTT._id}`);
    setTimetables((prev) => prev.filter((t) => t._id !== selectedTT._id));
    const savedTimetables = JSON.parse(localStorage.getItem('savedTimetables') || '[]') as { shareId: string }[];
  const updatedTimetables = savedTimetables.filter((tt: { shareId: string }) => tt.shareId !== selectedTT.shareId);
  localStorage.setItem('savedTimetables', JSON.stringify(updatedTimetables));

  closePopup("Timetable has been deleted.");
  }

  async function handleRename() {
    if (!selectedTT) return;
    await axios.patch(`/api/timetables/${selectedTT._id}`, {
      title: renameValue,
    });
    setTimetables((prev) =>
      prev.map((t) =>
        t._id === selectedTT._id ? { ...t, title: renameValue } : t
      )
    );
    closePopup("Timetable has been renamed.");
  }

  function openView(tt: TimetableEntry) {
    setPopupSlots(convertSlots(tt.slots));
    setPopupTitle(tt.title);
    setSelectedTT(tt);
    setPublicToggle(tt.isPublic);
    setPopupType("view_tt");
    setShowPopup(true);
  }

  async function handleCopyLink() {
    if (!selectedTT) return;
    // ensure shareId exists
    if (!selectedTT.isPublic) {
      await axios.patch(`/api/timetables/${selectedTT._id}`, {
        isPublic: true,
      });
      selectedTT.isPublic = true;
      setPublicToggle(true);
      setTimetables((prev) =>
        prev.map((t) =>
          t._id === selectedTT._id ? { ...t, isPublic: true } : t
        )
      );
    }
    const { data } = await axios.get(`/api/timetables/${selectedTT._id}`);
    const url = `${window.location.origin}/share/${data.shareId}`;
    await navigator.clipboard.writeText(url);
    setAlertMsg("Link copied!");
    setAlertOpen(true);
  }

  async function handleTogglePublic(state: "on" | "off") {
    if (!selectedTT) return;
    const isPub = state === "on";
    setPublicToggle(isPub);
    await axios.patch(`/api/timetables/${selectedTT._id}`, { isPublic: isPub });
    setTimetables((prev) =>
      prev.map((t) =>
        t._id === selectedTT._id ? { ...t, isPublic: isPub } : t
      )
    );
  }

  function closePopup(message: string) {
    setShowPopup(false);
    setSelectedTT(null);
    setAlertMsg(message);
    setAlertOpen(true);
  }

  return (
    <div className="flex flex-col min-h-screen relative select-none">
      <div className="absolute inset-0 -z-10 bg-[#CEE4E5]">
        <Image
          src="/art/bg_dots.svg"
          alt="Background"
          fill
          priority
          className="object-top object-contain"
        />
      </div>
      <Navbar page="saved" />
      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-6xl mt-48 mb-16 font-pangolin">Saved Timetables</h1>
        <div className="w-5/6 max-w-7xl rounded-[60px] border-4 border-black bg-[#A7D5D7] p-12 mb-24 shadow-[4px_4px_0_0_black]">
          <h2 className="text-4xl mb-8 font-pangolin font-light">
            All Timetables
          </h2>

          {loading ? (
            <Loader />
          ) : timetables.length === 0 ? (
            <div className="flex flex-col items-center">
              <p className="text-3xl mb-6">(No Timetables Found)</p>
              <ZButton
                onClick={() => router.push("/")}
                type="large"
                text="Home"
                color="purple"
                image="/icons/home.svg"
              />
            </div>
          ) : (
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
              {timetables.map((tt, i) => (
                <li
                  key={tt._id}
                  className="flex items-center justify-between bg-[#C9E5E6] p-5 rounded-4xl"
                >
                  <span className="text-xl">
                    {i + 1}. {tt.title}
                  </span>
                  <div className="flex gap-2">
                    <ZButton
                      type="image"
                      color="yellow"
                      image="/icons/eye.svg"
                      onClick={() => openView(tt)}
                    />
                    <ZButton
                      type="image"
                      color="blue"
                      image="/icons/edit.svg"
                      onClick={() => {
                        setSelectedTT(tt);
                        setRenameValue(tt.title);
                        setPopupType("rename_tt");
                        setShowPopup(true);
                      }}
                    />
                    <ZButton
                      type="image"
                      color="red"
                      image="/icons/trash.svg"
                      onClick={() => {
                        setSelectedTT(tt);
                        setPopupType("delete_tt");
                        setShowPopup(true);
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />

      {showPopup && selectedTT && popupType === "view_tt" && (
        <Popup
          type="view_tt"
          dataTitle={popupTitle}
          dataTT={popupSlots}
          closeLink={() => setShowPopup(false)}
          action={handleCopyLink}
          shareEnabledDefault={publicToggle}
          shareSwitchAction={handleTogglePublic}
        />
      )}
      {showPopup && selectedTT && popupType === "delete_tt" && (
        <Popup
          type="delete_tt"
          dataBody={selectedTT.title}
          closeLink={() => setShowPopup(false)}
          action={handleDelete}
        />
      )}
      {showPopup && selectedTT && popupType === "rename_tt" && (
        <Popup
          type="rename_tt"
          dataBody={renameValue}
          closeLink={() => setShowPopup(false)}
          action={handleRename}
          onInputChange={setRenameValue}
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
