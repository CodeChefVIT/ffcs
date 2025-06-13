"use client";

import TimeTable from "../timetable/TimeTable";
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

  const tfs = data.map((d) => {
    return { slotName: d.slot, showName: true };
  })

  return <div className="flex flex-col lg:flex-row gap-4 m-2 text-black text-sm font-inter select-none lg:overflow-x-auto">

    <div className="overflow-x-auto lg:overflow-x-visible">
      <div className="min-w-[830px] lg:w-[830px] h-[400px]">
        <TimeTable slotNames={tfs} />
      </div>
    </div>

    <div className="overflow-x-auto lg:overflow-x-visible">
      <div className="min-w-[400px] w-full lg:w-[400px] h-[320px] lg:h-[400px] bg-[#ffffff]/60 border-3 border-black p-4 rounded-2xl space-y-2 overflow-y-auto">
        {Object.entries(groupedData).map(([groupKey, entries], idx) => {
          const displayName = groupKey.split("__")[0];
          return (
            <div key={idx} className="border-b-1 border-black last:border-b-0 pb-2">
              <div className="space-y-1">
                {entries.map((entry, i) => (
                  <div key={i} className="flex px-2 min-w-0">
                    <div className="w-[80px] shrink-0 break-words whitespace-normal text-left">{entry.code}</div>
                    <div className="w-[96px] shrink-0 ml-4 mr-4 break-words whitespace-normal text-left">
                      {entry.slot.replace(/\+/g, '+\u200B')}
                    </div>
                    {i === 0
                      ? <div className="shrink-0 break-words whitespace-normal text-left pr-4">{displayName}</div>
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
  </div>
}
