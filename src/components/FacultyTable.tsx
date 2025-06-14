"use client";

import React from 'react';
import { facultyData } from '@/lib/type';

interface Props {
  facultyData?: facultyData;
  list: facultyData[];
}

export default function FacultyTable({ list }: Props) {
  return (
    <div className="h-full w-full border-2 border-black rounded-2xl p-4 flex flex-col overflow-hidden"
      style={{ backgroundColor: "#e5f9fa" }}
    >
      <ul
        className="space-y-2 flex-1 w-full"
        style={{
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>
          {`
            ul::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {list.map((fac, idx) => (
          <li
            key={idx}
            className="border-b border-black pb-1 flex justify-between items-center w-full"
            style={{ minWidth: 0 }}
          >
            <span
              className="text-left ml-2"
              style={{
                fontWeight: 'normal',
                fontSize: '1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
                flex: 1,
                maxWidth: '48%',
              }}
              title={fac.faculty}
            >
              {fac.faculty}
            </span>
            <span
              className="text-right text-black mr-3"
              style={{
                fontWeight: 'normal',
                fontSize: '1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
                flex: 1,
                maxWidth: '48%',
              }}
              title={fac.facultySlot.join(', ')}
            >
              {fac.facultySlot.join(', ')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
