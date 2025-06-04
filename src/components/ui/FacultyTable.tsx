import React from 'react';
import { IFacultyData } from '@/lib/type';

interface Props {
  facultyData?: IFacultyData;
  list: IFacultyData[];
}

export default function FacultyTable({ list }: Props) {
  return (
    <div className="h-full w-full bg-blue-100 border border-black rounded-3xl p-4 flex flex-col overflow-hidden">
      <h2 className="text-xl font-bold mb-4">Faculty List</h2>
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
            className="text-sm border-b border-black/10 pb-1 flex justify-between items-center w-full"
            style={{ minWidth: 0 }}
          >
            <span
              className="font-semibold text-left ml-2"
              style={{
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
              className="text-right text-blue-900 mr-2"
              style={{
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
