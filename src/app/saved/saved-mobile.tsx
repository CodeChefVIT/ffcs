'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import axios from 'axios';
import { PopupViewTT } from '@/components/ui/PopupMobile';
import AlertModal from '@/components/ui/AlertModal';
import { SavedTimetablesSkeleton } from './saved-skeleton';

async function fetchTimetablesByOwner(owner: string) {
  const res = await axios.get(`/api/timetables?owner=${encodeURIComponent(owner)}`);
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

export default function SavedMobile() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'view_tt' | 'delete_tt' | 'rename_tt' | null>(null);
  const [popupSlots, setPopupSlots] = useState<PopupSlot[]>([]);
  const [popupTitle, setPopupTitle] = useState<string>('');
  const [selectedTT, setSelectedTT] = useState<TimetableEntry | null>(null);
  const [publicToggle, setPublicToggle] = useState(true);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertColor, setAlertColor] = useState<'green' | 'red' | 'purple'>('purple');
  const [isCopying, setIsCopying] = useState(false);

  function showAlert(message: string, color: 'green' | 'red' | 'purple' = 'purple') {
    setAlertMsg(message);
    setAlertColor(color);
    setAlertOpen(true);
  }

  useEffect(() => {
    if (!userEmail) return;
    setLoading(true);
    fetchTimetablesByOwner(userEmail)
      .then(data => setTimetables(data))
      .catch(() => setTimetables([]))
      .finally(() => setLoading(false));
  }, [userEmail]);

  function convertSlots(slots: TimetableEntry['slots']): PopupSlot[] {
    return slots.map(item => ({
      code: item.courseCode,
      slot: item.slot,
      name: item.facultyName,
    }));
  }

  function handleView(tt: TimetableEntry) {
    setPopupSlots(convertSlots(tt.slots));
    setPopupTitle(tt.title);
    setPopupType('view_tt');
    setSelectedTT(tt);
    setPublicToggle(tt.isPublic);
    setShowPopup(true);
  }

  async function handleCopyLink(tt: TimetableEntry) {
    if (isCopying) return;
    setIsCopying(true);
    try {
      if (!publicToggle) {
        await axios.patch(`/api/timetables/${tt._id}`, {
          isPublic: true,
        });
        setPublicToggle(true);
        setTimetables(prev => prev.map(t => (t._id === tt._id ? { ...t, isPublic: true } : t)));
      }
      const res = await axios.get(`/api/timetables/${tt._id}`);
      const updated = res.data;
      if (!updated?.shareId) throw new Error('No shareId found');
      const url = `${window.location.origin}/share/${updated.shareId}`;

      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      showAlert('Link copied to clipboard!', 'green');
    } catch (err: unknown) {
      console.error('Failed to copy share link:', err);
      showAlert('Failed to copy link. Please try again.', 'red');
    } finally {
      setIsCopying(false);
    }
  }

  async function handleTogglePublic(state: 'on' | 'off') {
    if (!selectedTT) return;
    const isPub = state === 'on';
    setPublicToggle(isPub);
    try {
      await axios.patch(`/api/timetables/${selectedTT._id}`, {
        isPublic: isPub,
      });
      setTimetables(prev =>
        prev.map(tt => (tt._id === selectedTT._id ? { ...tt, isPublic: isPub } : tt))
      );
    } catch (err: unknown) {
      console.error('Failed to toggle public status:', err);
      setPublicToggle(!isPub);
      showAlert('Failed to update visibility. Please try again.', 'red');
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

      <Navbar page="mobile" />

      <div className="text-4xl mb-8 mt-28 text-black font-pangolin">Saved Timetables</div>

      {loading ? (
        <div className="w-full">
          <SavedTimetablesSkeleton />
        </div>
      ) : (
        <ul className="w-full space-y-4 px-6">
          {timetables.map((tt, index) => (
            <li
              key={tt._id}
              className="grid grid-cols-[auto_1fr] items-center px-3 py-3 bg-[#A7D5D7] text-black rounded-xl border-2 border-black shadow-[2px_2px_0_0_black]"
              onClick={() => handleView(tt)}
            >
              <span className="font-medium text-base mr-4">{index + 1}.</span>
              <span className="font-medium text-base truncate">{tt.title}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center w-full mt-8 mb-8 text-sm font-poppins font-semibold text-black/50 px-8">
        <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent to-black/33" />
        {loading ? null : timetables.length === 0 ? (
          <span className="mx-4">Nothing To Show Here</span>
        ) : (
          <span className="mx-4">End of List</span>
        )}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-black/33 to-transparent" />
      </div>

      {!loading && timetables.length === 0 ? (
        <div className="mx-auto my-auto text-center text-sm font-poppins font-semibold text-black/70">
          No saved timetables found.
          <br />
          Create and save from the desktop website.
        </div>
      ) : null}

      <Footer type="mobile" />

      {showPopup && popupType === 'view_tt' && selectedTT && (
        <PopupViewTT
          TTName={popupTitle}
          TTData={popupSlots}
          closeLink={() => setShowPopup(false)}
          onShareClick={() => handleCopyLink(selectedTT)}
          shareEnabledDefault={publicToggle}
          shareSwitchAction={handleTogglePublic}
          shareLink={
            selectedTT.shareId
              ? `${
                  typeof window !== 'undefined' ? window.location.origin : ''
                }/share/${selectedTT.shareId}`
              : ''
          }
        />
      )}

      <AlertModal
        open={alertOpen}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
        color={alertColor}
      />
    </div>
  );
}
