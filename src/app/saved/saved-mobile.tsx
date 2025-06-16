"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { getFavourites } from "@/services/api"; // Service function
import { useSession } from "next-auth/react";

interface FavouriteTimetable {
  name: string;
  id: string;
}

export default function SavedMobile() {
  const { data: session } = useSession();

  const [timetables, setTimetables] = useState<FavouriteTimetable[]>([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!session) return;
      try {
        const favourites = await getFavourites(session.user!.email!);
        setTimetables(favourites);
      } catch (err) {
        console.error("Failed to fetch favourites", err);
      }
    };

    fetchFavourites();
  }, [session]);

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
        />
      </div>

      <Navbar page="mobile" />

      <div className="text-4xl mb-8 mt-28 text-black font-pangolin">
        Saved Timetables
      </div>

      <ul className="w-full space-y-4 px-6">
        {timetables.map((item, index) => (
          <li
            key={item.id}
            className="grid grid-cols-[auto_1fr] items-center px-3 py-3 bg-[#A7D5D7] text-black rounded-xl border-2 border-black shadow-[2px_2px_0_0_black]"
          >
            <span className="font-medium text-base mr-4">{index + 1}.</span>
            <span className="font-medium text-base truncate">{item.name}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center w-full mt-8 mb-8 text-sm font-poppins font-semibold text-black/50 px-8">
        <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent to-black/33" />
        {timetables.length > 0 ? (
          <span className="mx-4">End of List</span>
        ) : (
          <span className="mx-4">Nothing To Show Here</span>
        )}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-black/33 to-transparent" />
      </div>

      {timetables.length === 0 && (
        <div className="mx-auto my-auto text-center text-sm font-poppins font-semibold text-black/70">
          You do not have any saved timetables.
          <br />
          Create and save from the desktop website.
        </div>
      )}

      <Footer type="mobile" />
    </div>
  );
}
