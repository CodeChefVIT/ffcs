"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Navbar from "@/components/ui/Navbar";
import { ZButton } from "@/components/ui/Buttons";
import Footer from "@/components/ui/Footer";

// --- New API call to fetch timetables by owner ---
async function fetchTimetablesByOwner(owner: string) {
  const res = await fetch(`/api/timetables?owner=${encodeURIComponent(owner)}`);
  if (!res.ok) throw new Error("Failed to fetch timetables");
  return res.json();
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

export default function Saved() {
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "sohammaha15@gmail.com"; // fallback for testing

  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;
    setLoading(true);
    fetchTimetablesByOwner(userEmail)
      .then((data) => setTimetables(data))
      .catch((err) => {
        setTimetables([]);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [userEmail]);

  return (
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

      <Navbar page="saved" />

      <div className="flex-1 flex flex-col items-center">
        <div className="text-6xl mt-48 mb-16 font-pangolin text-black">
          Your Timetables
        </div>

        <div className="z-10 w-5/6 max-w-7xl rounded-[60px] border-black border-4 bg-[#A7D5D7] px-24 py-12 mb-24 shadow-[4px_4px_0_0_black]">
          <div className="text-4xl mt-2 mb-8 font-pangolin font-light text-black">
            All Timetables
          </div>

          {loading ? (
            <div className="text-center text-2xl font-semibold text-[#606060] mb-6">
              Loading...
            </div>
          ) : timetables.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-12 mb-6">
              <div className="text-center text-2xl font-semibold text-[#606060] mb-6">
                (No Timetables Found)
              </div>
              <ZButton
                type="large"
                text="Home"
                color="purple"
                image="/icons/home.svg"
                onClick={() => router.push("/")}
              />
            </div>
          ) : (
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 font-poppins">
              {timetables.map((tt, index) => (
                <li
                  key={tt._id}
                  className="flex items-center justify-between bg-[#C9E5E6] p-4 rounded-3xl"
                >
                  <div className="flex flex-row">
                    <div className="text-xl mx-4 my-4">{index + 1}.</div>
                    <div className="text-xl ml-8 mr-4 my-4 overflow-hidden">
                      {tt.title}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <ZButton
                      type="regular"
                      text="View"
                      color="yellow"
                      image="/icons/eye.svg"
                      onClick={() => router.push(`/timetable/${tt._id}`)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
