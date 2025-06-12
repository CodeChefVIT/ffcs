"use client";

import { tableFacingSlot } from "@/lib/type";
import TimeTable from "./TimeTable";
import React from "react";

type dataProps = {
  code: string;
  slot: string;
  name: string;
}

type groupedDataProps = {
  [name: string]: { code: string; slot: string }[];
}

type CompoundTableProps = {
  data: dataProps[];
}

const tfs: tableFacingSlot[] = [
  { slotName: "A1", showName: true },
  { slotName: "B2", showName: true },
  { slotName: "D1+TD1", showName: true },
  { slotName: "F2", showName: true },
  { slotName: "L1+L2", showName: true },
  { slotName: "L11+L12", showName: true },
];


const data: dataProps[] = [
  { code: "BBRT101L", slot: "TG1", name: "Mansi Sharma" },
  { code: "BBRT101P", slot: "L21+L22", name: "Mansi Sharma" },
  { code: "BBIT101L", slot: "A1", name: "Monami Som Saha" },
  { code: "BBIT101P", slot: "L31+L32", name: "Monami Som Saha" },
  { code: "BERT101L", slot: "B1", name: "Yashita Puri" },
  { code: "BBRT101L", slot: "C1", name: "Kuriak Tom Jacob" },
  { code: "BBRT101P", slot: "L43+L44", name: "Kuriak Tom Jacob" },
  { code: "BBRT101L", slot: "D1", name: "Abhinav Pant" },
  { code: "BBRT101L", slot: "F2", name: "Ishan Jindal" },
];

const getGroupedData = (data: dataProps[]): groupedDataProps => {
  return data.reduce((acc, { code, slot, name }) => {
    // Use code prefix (all except last char) + name as the grouping key
    const codePrefix = code.slice(0, -1);
    const groupKey = `${name}__${codePrefix}`;
    (acc[groupKey] ||= []).push({ code, slot });
    return acc;
  }, {} as groupedDataProps);
}

export default function CompoundTable({ data }: CompoundTableProps) {
  const groupedData = getGroupedData(data);
  console.log("groupedData", groupedData);

  return <div className="flex flex-row">

    <div className="w-[1000px] h-[480px]">
      <TimeTable slotNames={tfs} />
    </div>

    <div className="p-6 bg-blue-50 rounded-xl border max-w-md mx-auto space-y-4">
      {Object.entries(groupedData).map(([groupKey, entries], idx) => {
        const displayName = groupKey.split("__")[0]; // Extract original name
        return (
          <div key={idx} className="border-b last:border-b-0 pb-2">
            <div className="space-y-1">
              {entries.map((entry, i) => (
                <div key={i} className="grid grid-cols-3 text-sm">
                  <div>{entry.code}</div>
                  <div>{entry.slot}</div>
                  {i === 0 && <div>{displayName}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>

  </div>
}
