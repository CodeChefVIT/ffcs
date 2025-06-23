"use client";

import Image from "next/image";
import { useState } from "react";

import { clashMap, getAllSlots } from "@/lib/slots";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { ZButton, SlotToggleButton } from "@/components/ui/Buttons";
import TimeTable from "@/components/ui/TimeTable";

export default function View() {
  const [active, setActive] = useState<number[]>([]);
  const buttonTexts = getAllSlots();
  const disableMap = clashMap;

  const [selected, setSelected] = useState("Theory");

  const handleClick = (index: number) => {
    if (active.includes(index)) setActive(active.filter((i) => i !== index));
    else setActive([...active, index]);
  };

  const rowFilters = [
    (text: string, end: string) =>
      !text.startsWith("T") && !text.startsWith("L") && text.endsWith(end),
    (text: string, end: string) =>
      text.startsWith("T") && text.endsWith(end) && text.length === 3,
    (text: string, end: string) =>
      text.startsWith("T") && text.endsWith(end) && text.length === 4,
  ];

  const lSlotPairs: string[] = [];
  for (let i = 1; i <= 60; i += 2) {
    lSlotPairs.push(`L${i}+L${i + 1}`);
  }
  const lSlotPairsCol1 = lSlotPairs.slice(0, 15);
  const lSlotPairsCol2 = lSlotPairs.slice(15);

  return (
    <div className="flex flex-col min-h-screen relative select-none">
      {/* Background Image */}
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

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center">
        <Navbar page="slots" />

        <div className="text-6xl mt-36 mb-4 font-pangolin text-black">
          Slot View
        </div>

        <div className="mt-8 mb-8">
          <SlotToggleButton onToggle={setSelected} />
        </div>

        {selected === "Theory" && (
          <div className="flex gap-16 mt-6">
            {/* Morning Theory */}
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((row) => (
                <div
                  key={`morning-row-${row}`}
                  className={`grid ${row < 2 ? "grid-cols-7" : "grid-cols-4"} gap-2`}
                >
                  {buttonTexts
                    .filter((text) => rowFilters[row](text, "1"))
                    .map((text) => {
                      const idx = buttonTexts.indexOf(text);
                      const activeTexts = active.map((i) => buttonTexts[i]);
                      const isDisabled = activeTexts.some((activeText) =>
                        disableMap[activeText.split("+")[0]]?.includes(
                          text.split("+")[0]
                        )
                      );
                      return (
                        <ZButton
                          type="regular"
                          key={`morning-${text}`}
                          text={text}
                          color="blue"
                          clicked={active.includes(idx)}
                          disabled={!!isDisabled}
                          onClick={() => handleClick(idx)}
                        />
                      );
                    })}
                </div>
              ))}
            </div>

            {/* Evening Theory */}
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((row) => (
                <div
                  key={`evening-row-${row}`}
                  className={`grid ${row < 2 ? "grid-cols-7" : "grid-cols-4"} gap-2`}
                >
                  {buttonTexts
                    .filter((text) => rowFilters[row](text, "2"))
                    .map((text) => {
                      const idx = buttonTexts.indexOf(text);
                      const activeTexts = active.map((i) => buttonTexts[i]);
                      const isDisabled = activeTexts.some((activeText) =>
                        disableMap[activeText.split("+")[0]]?.includes(
                          text.split("+")[0]
                        )
                      );
                      return (
                        <ZButton
                          type="regular"
                          key={`evening-${text}`}
                          text={text}
                          color="blue"
                          clicked={active.includes(idx)}
                          disabled={!!isDisabled}
                          onClick={() => handleClick(idx)}
                        />
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        )}

        {selected === "Lab" && (
          <div className="flex gap-16 mt-8">
            {/* Morning Lab */}
            <div className="grid grid-cols-3 gap-2">
              {lSlotPairsCol1.map((pair) => {
                const btnIdx = buttonTexts.findIndex((text) => text === pair);
                const activeTexts = active.map((i) => buttonTexts[i]);
                const isDisabled = activeTexts.some((activeText) =>
                  disableMap[activeText.split("+")[0]]?.includes(
                    pair.split("+")[0]
                  )
                );
                return (
                  <ZButton
                    type="regular"
                    key={pair}
                    text={pair}
                    color="blue"
                    clicked={btnIdx !== -1 && active.includes(btnIdx)}
                    disabled={!!isDisabled || btnIdx === -1}
                    onClick={() => btnIdx !== -1 && handleClick(btnIdx)}
                  />
                );
              })}
            </div>

            {/* Evening Lab */}
            <div className="grid grid-cols-3 gap-2">
              {lSlotPairsCol2.map((pair) => {
                const btnIdx = buttonTexts.findIndex((text) => text === pair);
                const activeTexts = active.map((i) => buttonTexts[i]);
                const isDisabled = activeTexts.some((activeText) =>
                  disableMap[activeText.split("+")[0]]?.includes(
                    pair.split("+")[0]
                  )
                );
                return (
                  <ZButton
                    type="regular"
                    key={pair}
                    text={pair}
                    color="blue"
                    clicked={btnIdx !== -1 && active.includes(btnIdx)}
                    disabled={!!isDisabled || btnIdx === -1}
                    onClick={() => btnIdx !== -1 && handleClick(btnIdx)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Timetable Section */}
        <div className="mx-auto mt-12 mb-10 w-full max-w-[1000px]">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] h-[480px]">
              <TimeTable
                slotNames={active.map((i) => ({
                  slotName: buttonTexts[i],
                  showName: true,
                }))}
              />
            </div>
          </div>
        </div>
      </main>

      
      <Footer />
    </div>
  );
}
