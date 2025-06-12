"use client";

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

const sortData = (data: dataProps[]): dataProps[] => {
  return [...data].sort((a, b) => a.code.localeCompare(b.code));
}

const getGroupedData = (data: dataProps[]): groupedDataProps => {
  return sortData(data).reduce((acc, { code, slot, name }) => {
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

  const tfs = data.map((d) => {
    return { slotName: d.slot, showName: true };
  })

  return <div className="flex flex-row gap-8 m-8 text-black text-sm font-inter select-none">

    <div className="w-[830px] h-[400px]">
      <TimeTable slotNames={tfs} />
    </div>

    <div className="h-[400px] max-w-[480px] bg-[#ffffff]/60 border-3 border-black p-4 rounded-2xl space-y-2 overflow-y-auto overflow-x-auto">
      {Object.entries(groupedData).map(([groupKey, entries], idx) => {
        const displayName = groupKey.split("__")[0];
        return (
          <div key={idx} className="border-b-1 border-black last:border-b-0 pb-2">
            <div className="space-y-1">
              {entries.map((entry, i) => (
                <div key={i} className="flex px-2 min-w-0">
                  <div className="w-[80px] shrink-0 break-words whitespace-normal">{entry.code}</div>
                  <div className="w-[96px] shrink-0 ml-4 mr-4 break-words whitespace-normal">
                    {entry.slot.replace(/\+/g, '+\u200B')}
                  </div>
                  {i === 0
                    ? <div className="shrink-0 break-words whitespace-normal pr-4">{displayName}</div>
                    : <div className="shrink-0"></div>
                  }
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>

  </div>
}
