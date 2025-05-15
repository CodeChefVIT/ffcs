import React from 'react';
import { slot } from '../type';


export default function TimeTable({ data }: {data: slot[]}) {
  return (
    <div className="grid grid-rows-6 grid-cols-42 gap-1 p-2">
      {data.map((slot, index) => (
        <div
          key={index}
          className="bg-blue-500 text-white text-center rounded"
          style={{
            gridColumnStart: slot.colStart,
            gridColumnEnd: slot.colEnd,
            gridRow: slot.row,
          }}
        >
          Slot {index + 1}
        </div>
      ))}
    </div>
  );
}