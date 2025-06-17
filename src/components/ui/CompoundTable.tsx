"use client";

import TimeTable from "./TimeTable";
import React, { forwardRef } from "react";

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
  timetableRef?: React.Ref<HTMLDivElement>;
};

const sortData = (data: dataProps[]): dataProps[] => {
  return [...data].sort((a, b) => a.code.localeCompare(b.code));
};

const getGroupedData = (data: dataProps[]): groupedDataProps => {
  return sortData(data).reduce((acc, { code, slot, name }) => {
    const codePrefix = code.slice(0, -1);
    const groupKey = `${name}__${codePrefix}`;
    (acc[groupKey] ||= []).push({ code, slot });
    return acc;
  }, {} as groupedDataProps);
};

const CompoundTable = forwardRef<HTMLDivElement, CompoundTableProps>(({ data, large, timetableRef }, ref) => {
  const groupedData = getGroupedData(data);

  const tfs = data.map((d) => {
    return { slotName: d.slot, showName: true };
  });

  return (
    <div className="flex flex-col lg:flex-row gap-4 m-2 text-black text-sm font-inter select-none lg:overflow-x-auto">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <div
          className={` ${large ? "w-[1000px] h-[480px]" : "w-[830px] h-[400px]"}`}
          ref={timetableRef} 
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
            return (
              <div key={idx} className="border-b-1 border-black last:border-b-0 pb-2">
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
                        {i === 0 ? displayName : ""}
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
});

CompoundTable.displayName = "CompoundTable";
export default CompoundTable;
