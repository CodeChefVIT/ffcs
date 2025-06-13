"use client";

import { useState } from "react";
import Image from "next/image";
import router from "next/router";

import { ZButton } from "@/components/ui/Buttons";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import Popup from "@/components/ui/Popup";

export default function Saved() {

  const [timetables, setTimetables] = useState<string[]>([
    "Evening Theory",
    "5:30 before lab",
    "Too good to be true",
    "FFCS hatao desh bachao",
    "Abki baar Vishwanathan Sarkar",
    "Dummy Timetable",
    "Another Timetable",
    "Yet Another Timetable",
  ]);

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [indexToDelete, setIndexToDelete] = useState<number | null>(null);
  const [TimetableToDelete, setTimetableToDelete] = useState<string | null>(null);

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

  const confirmDelete = () => {
    if (indexToDelete !== null) {
      handleDelete(indexToDelete);
      setIsDeletePopupOpen(false);
      setIndexToDelete(null);
      setTimetableToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeletePopupOpen(false);
    setIndexToDelete(null);
    setTimetableToDelete(null);
  };

  return (
    <div className="flex flex-col min-h-screen relative select-none items-center">
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

      <Navbar page="saved" loggedin={true} />

      <div className="text-6xl mt-48 mb-16 font-pangolin text-black">Saved Timetables</div>

      <div className="z-10 w-5/6 max-w-7xl rounded-[60px] border-black border-4 bg-[#A7D5D7] px-24 py-12 mb-24 shadow-[4px_4px_0_0_black]">

        <div className="text-4xl mt-2 mb-8 font-pangolin font-light text-black">Your Saved Timetables</div>

        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 font-poppins">
          {timetables.length === 0 ? (
            <li className="flex flex-col items-center justify-center mt-12 mb-6">
              <div className="text-center text-2xl font-semibold text-[#606060] mb-6">
                (No Saved Timetables)
              </div>
              <ZButton
                type="large"
                text="Home"
                color="purple"
                image="/icons/home.svg"
                onClick={() => router.push('/')}
              />
            </li>
          ) : (
            timetables.map((name: string, index: number) => (
              <li
                key={index}
                className="flex items-center justify-between bg-[#C9E5E6] p-4 rounded-3xl"
              >
                {editingIndex === index ? (
                  <input
                    type="text"
                    className="flex-1 ml-2 mr-2 px-4 py-2 rounded-lg border border-black bg-white font-semibold text-[#505050]"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  <div className="flex flex-row">
                    <div className="text-xl mx-4 my-4">{index + 1}.</div>
                    <div className="text-xl ml-8 mr-4 my-4 overflow-hidden">{name}</div>
                  </div>
                )}

                <div className="flex space-x-2">
                  {editingIndex === index ? (
                    <>
                      <button
                        className="w-10 h-10 bg-[#53ec8e] border-1 border-black p-2 m-2 rounded-lg cursor-pointer"
                        onClick={handleSaveRename}
                      >
                        <Image
                          src="/icons/check.svg"
                          alt="Save"
                          width={24}
                          height={24}
                          className="m-auto"
                        />
                      </button>
                      <button
                        className="w-10 h-10 bg-[#FFA3A3] border-1 border-black p-2 m-2 rounded-lg cursor-pointer"
                        onClick={handleCancelRename}
                      >
                        <Image
                          src="/icons/cross.svg"
                          alt="Cancel"
                          width={24}
                          height={24}
                          className="m-auto"
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="w-10 h-10 bg-[#E5F3F3] hover:bg-[#FFEA79] border-1 border-black p-2 m-2 rounded-lg cursor-pointer transition-colors"
                        onClick={() => setIsPopupOpen(true)}
                      >
                        <Image
                          src="/icons/eye.svg"
                          alt="View"
                          width={24}
                          height={24}
                          className="m-auto"
                        />
                      </button>

                      <button
                        className="w-10 h-10 bg-[#E5F3F3] hover:bg-[#9ABCFF] border-1 border-black p-2 m-2 rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleRename(index)}
                      >
                        <Image
                          src="/icons/edit.svg"
                          alt="Rename"
                          width={24}
                          height={24}
                          className="m-auto"
                        />
                      </button>

                      <button
                        className="w-10 h-10 bg-[#E5F3F3] hover:bg-[#FFA3A3] border-1 border-black p-2 m-2 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          setIsDeletePopupOpen(true);
                          setIndexToDelete(index);
                          setTimetableToDelete(timetables[index]);
                        }}
                      >
                        <Image
                          src="/icons/trash.svg"
                          alt="Delete"
                          width={24}
                          height={24}
                          className="m-auto"
                        />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <Footer />

      {isPopupOpen && (
        <Popup
          type="share_tt"
          closeLink={() => setIsPopupOpen(false)}
          dataBody="ffcs.codechefvit.com/share?id=ABC123"
        />
      )}

      {isDeletePopupOpen && (
        <Popup
          type="delete_tt"
          closeLink={cancelDelete}
          action={confirmDelete}
          dataBody={TimetableToDelete || ""}
        />
      )}

    </div>
  );
}
