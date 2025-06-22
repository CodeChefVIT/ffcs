"use client";

import React from "react";
import { slot } from "@/lib/type";
import { getSlot, getAllSlots } from "@/lib/slots";
import Image from "next/image";

export type tableFacingSlot = {
  slotName: string;
  showName: boolean;
};

export default function TimeTable({
  slotNames,
}: {
  slotNames: tableFacingSlot[];
}) {
  const slots: slot[] = slotNames
    .map((slotNames) => getSlot(slotNames.slotName, slotNames.showName))
    .flat();

  const ROWS = 17;
  const COLUMNS = 69;
  const ROW_WEIGHTS = [5, 5, 2, 5, 5, 2, 5, 5, 2, 5, 5, 2, 5, 5, 2, 5, 5];
  const COLUMN_WEIGHTS = Array(69)
    .fill(1)
    .map((v, i) => (i === 0 ? 5 : 1));
  const LAB_ROWS = [5, 8, 11, 14, 17];

  const totalRowWeight = ROW_WEIGHTS.reduce((a, b) => a + b, 0);
  const gridTemplateRows = ROW_WEIGHTS.map(
    (w) => `${(w / totalRowWeight) * 100}%`
  ).join(" ");
  const totalColWeight = COLUMN_WEIGHTS.reduce((a, b) => a + b, 0);
  const gridTemplateColumns = COLUMN_WEIGHTS.map(
    (w) => `${(w / totalColWeight) * 100}%`
  ).join(" ");

  const MERGE_CELLS_BOLD_TEXT: slot[] = [
    { colStart: 1, colEnd: 2, rowStart: 4, rowEnd: 6, slotName: "Mon" },
    { colStart: 1, colEnd: 2, rowStart: 7, rowEnd: 9, slotName: "Tue" },
    { colStart: 1, colEnd: 2, rowStart: 10, rowEnd: 12, slotName: "Wed" },
    { colStart: 1, colEnd: 2, rowStart: 13, rowEnd: 15, slotName: "Thu" },
    { colStart: 1, colEnd: 2, rowStart: 16, rowEnd: 18, slotName: "Fri" },

    { colStart: 2, colEnd: 3, rowStart: 1, rowEnd: 2, slotName: "8" },
    { colStart: 8, colEnd: 9, rowStart: 1, rowEnd: 2, slotName: "9" },
    { colStart: 14, colEnd: 15, rowStart: 1, rowEnd: 2, slotName: "10" },
    { colStart: 20, colEnd: 21, rowStart: 1, rowEnd: 2, slotName: "11" },
    { colStart: 26, colEnd: 27, rowStart: 1, rowEnd: 2, slotName: "12" },
    { colStart: 32, colEnd: 33, rowStart: 1, rowEnd: 2, slotName: "1" },
    { colStart: 38, colEnd: 39, rowStart: 1, rowEnd: 2, slotName: "2" },
    { colStart: 44, colEnd: 45, rowStart: 1, rowEnd: 2, slotName: "3" },
    { colStart: 50, colEnd: 51, rowStart: 1, rowEnd: 2, slotName: "4" },
    { colStart: 56, colEnd: 57, rowStart: 1, rowEnd: 2, slotName: "5" },
    { colStart: 62, colEnd: 63, rowStart: 1, rowEnd: 2, slotName: "6" },
    { colStart: 68, colEnd: 69, rowStart: 1, rowEnd: 2, slotName: "7" },

    {
      colStart: 2,
      colEnd: 32,
      rowStart: 2,
      rowEnd: 3,
      slotName: "Morning Theory",
    },
    { colStart: 32, colEnd: 38, rowStart: 2, rowEnd: 3, slotName: "Break" },
    {
      colStart: 38,
      colEnd: 70,
      rowStart: 2,
      rowEnd: 3,
      slotName: "Evening Theory",
    },

    { colStart: 2, colEnd: 70, rowStart: 3, rowEnd: 4, slotName: "" },
    { colStart: 2, colEnd: 70, rowStart: 6, rowEnd: 7, slotName: "" },
    { colStart: 2, colEnd: 70, rowStart: 9, rowEnd: 10, slotName: "" },
    { colStart: 2, colEnd: 70, rowStart: 12, rowEnd: 13, slotName: "" },
    { colStart: 2, colEnd: 70, rowStart: 15, rowEnd: 16, slotName: "" },

    { colStart: 31, colEnd: 38, rowStart: 4, rowEnd: 5, slotName: "" },
    { colStart: 31, colEnd: 38, rowStart: 7, rowEnd: 8, slotName: "" },
    { colStart: 19, colEnd: 38, rowStart: 10, rowEnd: 11, slotName: "" },
    { colStart: 31, colEnd: 38, rowStart: 13, rowEnd: 14, slotName: "" },
    { colStart: 31, colEnd: 38, rowStart: 16, rowEnd: 17, slotName: "" },

    { colStart: 34, colEnd: 38, rowStart: 5, rowEnd: 6, slotName: "" },
    { colStart: 34, colEnd: 38, rowStart: 8, rowEnd: 9, slotName: "" },
    { colStart: 34, colEnd: 38, rowStart: 11, rowEnd: 12, slotName: "" },
    { colStart: 34, colEnd: 38, rowStart: 14, rowEnd: 15, slotName: "" },
    { colStart: 34, colEnd: 38, rowStart: 17, rowEnd: 18, slotName: "" },

    { colStart: 67, colEnd: 70, rowStart: 4, rowEnd: 5, slotName: "" },
    { colStart: 67, colEnd: 70, rowStart: 7, rowEnd: 8, slotName: "" },
    { colStart: 67, colEnd: 70, rowStart: 10, rowEnd: 11, slotName: "" },
    { colStart: 67, colEnd: 70, rowStart: 13, rowEnd: 14, slotName: "" },
    { colStart: 67, colEnd: 70, rowStart: 16, rowEnd: 17, slotName: "" },
  ];

  const MERGE_CELLS_SLOTS: slot[] = [];
  const allSlotsWithoutName: slot[] = getAllSlots()
    .map((slotName) => getSlot(slotName, true))
    .flat();

  MERGE_CELLS_SLOTS.push(
    ...allSlotsWithoutName.map((slot) => ({
      colStart: slot.colStart,
      colEnd: slot.colEnd,
      rowStart: slot.rowStart,
      rowEnd: slot.rowEnd,
      slotName: slot.slotName,
    }))
  );

  const cells = [];
  for (let row = 1; row <= ROWS; row++) {
    for (let col = 1; col <= COLUMNS; col++) {
      cells.push(
        <div
          key={`cell-${row}-${col}`}
          className="border-black border-[0.5px] w-full h-full box-border bg-white"
          style={{ gridColumn: col, gridRow: row }}
        />
      );
    }
  }

  return (
    <div
      className="grid bg-black relative w-full h-full p-[1px] select-none font-inter"
      style={{ gridTemplateColumns, gridTemplateRows }}
    >
      {cells}
      <div
        key="image-cell"
        className="col-[1] row-start-[1] row-end-[3] bg-white border-black border-[0.5px] box-border flex items-center justify-center"
      >
        <Image
          src="/logo_ffcs.svg"
          alt="logo of FFCS Platform by CodeChef-VIT"
          width={120}
          height={80}
          className="w-auto h-2/3 block opacity-90 select-none pointer-events-none"
          draggable={false}
          unselectable="on"
          priority
        />
      </div>

      {MERGE_CELLS_BOLD_TEXT.map((cell, i) => (
        <div
          key={`merge-cell-${i}`}
          className="bg-white border-black border-[0.5px] box-border flex items-center justify-center w-full h-full overflow-hidden"
          style={{
            gridColumnStart: cell.colStart,
            gridColumnEnd: cell.colEnd,
            gridRowStart: cell.rowStart,
            gridRowEnd: cell.rowEnd,
          }}
        >
          <span className="w-full h-full flex items-center justify-center font-bold whitespace-nowrap overflow-hidden text-ellipsis text-xs">
            {cell.slotName}
          </span>
        </div>
      ))}

      {MERGE_CELLS_SLOTS.map((cell, i) => (
        <div
          key={`slot-${i}`}
          className="bg-white border-black border-[0.5px] box-border flex items-center justify-center w-full h-full overflow-hidden"
          style={{
            gridColumnStart: cell.colStart,
            gridColumnEnd: cell.colEnd,
            gridRowStart: cell.rowStart,
            gridRowEnd: cell.rowEnd,
          }}
        >
          <span className="w-full h-full flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis text-xs">
            {cell.slotName}
          </span>
        </div>
      ))}

      {slots.map((slot, i) => (
        <div
          key={`slot-${i}`}
          className={`border-black border-[0.5px] box-border flex items-center justify-center w-full h-full overflow-hidden ${
            LAB_ROWS.includes(slot.rowStart) ? "bg-[#96FFCA]" : "bg-[#86d7FF]"
          }`}
          style={{
            gridColumnStart: slot.colStart,
            gridColumnEnd: slot.colEnd,
            gridRowStart: slot.rowStart,
            gridRowEnd: slot.rowEnd,
          }}
        >
          <span className="w-full h-full flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis text-xs">
            {slot.slotName}
          </span>
        </div>
      ))}
    </div>
  );
}
