"use client";

import TimeTable from "./TimeTable";
import React from "react";

type dataProps = {
  code: string;
  slot: string;
  name: string;
};

type groupedDataProps = {
  [name: string]: { code: string; slot: string }[];
};

type CompoundTableProps = {
  data: dataProps[];
  large?: boolean;
};

const sortData = (data: dataProps[]): dataProps[] => {
  return [...data].sort((a, b) => a.code.localeCompare(b.code));
};

const getGroupedData = (data: dataProps[]): groupedDataProps => {
  return sortData(data).reduce((acc, { code, slot, name }) => {
    // Use code prefix (all except last char) + name as the grouping key
    const codePrefix = code.slice(0, -1);
    const groupKey = `${name}__${codePrefix}`;
    (acc[groupKey] ||= []).push({ code, slot });
    return acc;
  }, {} as groupedDataProps);
};

export default function CompoundTable({ data, large }: CompoundTableProps) {
  const groupedData = getGroupedData(data);

  const tfs = data.map((d) => {
    return { slotName: d.slot, showName: true };
  });

  return (
    <div className="flex flex-col lg:flex-row gap-4 m-2 text-black text-sm font-inter select-none lg:overflow-x-auto">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <div
          className={`
        ${large ? "w-[1000px] h-[480px]" : "w-[830px] h-[400px]"}
      `}
        >
          <TimeTable slotNames={tfs} />
        </div>
      </div>

      <div className="overflow-x-auto lg:overflow-x-visible">
        <div
          className={`
        w-full min-w-[400px]
        ${large ? "h-[360px] lg:h-[480px]" : "h-[320px] lg:h-[400px]"}

        bg-[#ffffff]/60 p-4
        border-3 border-black
        rounded-2xl space-y-2
        overflow-y-auto
      `}
        >
          {Object.entries(groupedData).map(([groupKey, entries], idx) => {
            const displayName = groupKey.split("__")[0];
            //console.log(displayName)
            let initials = "";
            const parts = displayName.split(" ");

            if (displayName.length > 12) {
              initials = parts[0];
              if (parts.length > 1) {
                initials += " " + parts[1].charAt(0);
              }
              initials += " " + parts[parts.length - 1].charAt(0);
            } else {
              initials = displayName;
            }

            console.log();
            return (
              <div
                key={idx}
                className="border-b-1 border-black last:border-b-0 pb-2"
              >
                <div className="space-y-1">
                  {entries.map((entry, i) => (
                    <div key={i} className="flex px-2 min-w-0 justify-between">
                      <div className="w-[80px] shrink-0 break-words whitespace-normal text-left">
                        {entry.code}
                      </div>
                      <div className="w-[80px] shrink-0 ml-4 mr-4 break-words whitespace-normal text-left">
                        {entry.slot.replace(/\+/g, "+\u200B")}
                      </div>
                      <div className="w-[160px] shrink-0 break-words whitespace-normal text-right pr-4">
                        {i === 0 ? initials : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
