"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Edit, Trash2, Check, X } from "lucide-react";

import useScreenSize from "@/hooks/useScreenSize";
import SavedMobile from "./saved-mobile";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import Popup from "@/components/ui/popup";

export default function Saved() {
  const size = useScreenSize();

  const [timetables, setTimetables] = useState<string[]>([
    "Evening Theory",
    "5:30 before lab",
    "Too good to be true",
    "FFCS hatao desh bachao",
    "Abki baar vishu ki sarkar",
    "somethng",
    "vit is the best"
  ]);

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");

  const handleDelete = (indexToDelete: number): void => {
    setTimetables((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleRename = (index: number): void => {
    setEditingIndex(index);
    setEditedName(timetables[index]);
  };

  const handleSaveRename = () => {
    if (editingIndex !== null && editedName.trim() !== "") {
      setTimetables((prev) =>
        prev.map((name, i) => (i === editingIndex ? editedName.trim() : name))
      );
      setEditingIndex(null);
      setEditedName("");
    }
  };

  const handleCancelRename = () => {
    setEditingIndex(null);
    setEditedName("");
  };

  if (size === "mobile") {
    return <SavedMobile />;
  }

  return (
    <>
      <header></header>
      <Navbar page="saved" loggedin={true} />
      <section className="w-full min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
        <Image
          src="/art/bg_dots.svg"
          alt="Background of ffcs page"
          fill
          className="object-cover z-0"
        />

        <h1 className="text-5xl font-light z-10 mb-6 mt-24 p-6 font-pangolin text-black">
          Saved Timetables
        </h1>

        <div className="z-10 w-11/12 max-w-7xl rounded-[2rem] border-black border-3 bg-[#a6dde0]/90 p-6 shadow-lg backdrop-blur-md mb-20">
          <p className="mb-8 mt-2 ml-2 text-3xl font-light font-pangolin">
            Your Saved Timetables
          </p>

          <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 font-poppins">
            {timetables.length === 0 ? (
              <li className="text-center text-lg text-gray-700">No timetables saved.</li>
            ) : (
              timetables.map((name: string, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-[#d2f4f6] px-6 py-3 rounded-3xl"
                >
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className="flex-1 mr-4 px-3 py-1 rounded-md border border-gray-400"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    <span className="text-small">
                      {index + 1}. {name}
                    </span>
                  )}

                  <div className="flex space-x-2">
                    {editingIndex === index ? (
                      <>
                        <button
                          className="bg-green-300 p-2 m-2 rounded-md hover:scale-110 cursor-pointer"
                          onClick={handleSaveRename}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          className="bg-red-300 p-2 m-2 rounded-md hover:scale-110 cursor-pointer"
                          onClick={handleCancelRename}
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-yellow-200 p-2 m-2 rounded-md hover:scale-110 cursor-pointer"
                          onClick={() => setIsPopupOpen(true)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="bg-blue-300 p-2 m-2 rounded-md hover:scale-110 cursor-pointer"
                          onClick={() => handleRename(index)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="bg-red-300 p-2 m-2 rounded-md hover:scale-110 cursor-pointer"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
      <Footer />
      {isPopupOpen &&
        <Popup type="share_tt" closeLink={() => setIsPopupOpen(false)} dataBody="ffcs.codechefvit.com/share?id=ABC123" />
      }
    </>
  );
}
