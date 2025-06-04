'use client';

import React, { useState } from 'react';
import TimeTable from '@/components/timetable/TimeTable';
import FacultyTable from '@/components/ui/FacultyTable';
import { IFacultyData, tableFacingSlot } from '@/lib/type';

const extractSlotNames = (facultyData: IFacultyData[]): tableFacingSlot[] => {
  const slotSet = new Set<string>();
  facultyData.forEach(faculty => {
    faculty.facultySlot.forEach(group => {
      group.split('+').forEach(slotName => {
        slotSet.add(slotName);
      });
    });
  });
  return Array.from(slotSet).map(slotName => ({ slotName, showName: true }));
};

const initialFacultyData: IFacultyData[][] = [
  [
  {
    _id: '1',
    faculty: 'DHIVYAA C R',
    facultySlot: ['G1'],
    subject: 'BCSE102P - Structured and Object-Oriented Programming Lab'
  },
  {
    _id: '2',
    faculty: 'DHIVYAA C R',
    facultySlot: ['L43+L44+L53+L54'],
    subject: 'BENG101L - Technical English Communication'
  },
  {
    _id: '3',
    faculty: 'SOUMEN MUKHERJEE',
    facultySlot: ['B1'],
    subject: 'BENG101P - Technical English Communication Lab'
  },
  {
    _id: '4',
    faculty: 'SOUMEN MUKHERJEE',
    facultySlot: ['L45+L46'],
    subject: 'BHUM101N - Ethics and Values'
  },
  {
    _id: '5',
    faculty: 'BHUVANESWARI M',
    facultySlot: ['NIL'],
    subject: 'BHUM220L - Financial Markets and Institutions'
  },
  {
    _id: '6',
    faculty: 'SAVITHA N',
    facultySlot: ['C1+TC1'],
    subject: 'BMAT101L - Calculus'
  },
  {
    _id: '7',
    faculty: 'ARUN KUMAR BADAJENA',
    facultySlot: ['D1+TD1'],
    subject: 'BMAT101P - Calculus Lab'
  },
  {
    _id: '8',
    faculty: 'ARUN KUMAR BADAJENA',
    facultySlot: ['L35+L36'],
    subject: 'BPHY101L - Engineering Physics'
  },
  {
    _id: '9',
    faculty: 'KANHAIYA LAL PANDEY',
    facultySlot: ['E1+TE1'],
    subject: 'BPHY101P - Engineering Physics Lab'
  },
  {
    _id: '10',
    faculty: 'KANHAIYA LAL PANDEY',
    facultySlot: ['L47+L48'],
    subject: 'BSTS101P - Quantitative Skills Practice I'
  },
  {
    _id: '11',
    faculty: 'SIXPHRASE (APT)',
    facultySlot: ['F1+TF1'],
    subject: 'BSTS101P - Quantitative Skills Practice I'
  }
],
  [
    { faculty: 'John Doe', facultySlot: ['A1+TA1+TAA1'], _id: '1' },
    { faculty: 'Jane Smith', facultySlot: ['B2', 'L1+L2'], _id: '2' },
    { faculty: 'f3', facultySlot: ['A2'], _id: '3' },
    { faculty: 'f4', facultySlot: ['B1'], _id: '4' },
    { faculty: 'f5', facultySlot: ['D1+TD1', 'E1+TE1'], _id: '5' },
  ],
  [
    { faculty: 'Alice Johnson', facultySlot: ['C1', 'C2'], _id: '6' },
    { faculty: 'Tom Hardy', facultySlot: ['L1+L2', 'A2'], _id: '7' },
    { faculty: 'Priya Kumar', facultySlot: ['B1', 'C2'], _id: '8' },
  ],
];

export default function View() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedData = initialFacultyData[selectedIndex];
  const slotNames: tableFacingSlot[] = extractSlotNames(selectedData);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#a7d5d7]">
      <div className="flex flex-col h-full max-w-[1600px] mx-auto min-w-[1000px] px-6 py-4 box-border">
        
        
        <h1 className="text-[2.5vw] font-bold leading-tight mb-4 text-left">
          Your TimeTable
        </h1>
        
        <div className="flex flex-1 gap-6 overflow-hidden">
          <div className="flex-[2] overflow-auto rounded  p-2">
            <TimeTable slotNames={slotNames} />
          </div>
          <div className="flex-1 overflow-auto rounded p-2">
            <FacultyTable list={selectedData} />
          </div>
        </div>

        
        <div className="mt-4 flex gap-2 justify-start">
          {initialFacultyData.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`px-4 py-2 rounded border ${
                selectedIndex === i
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border-blue-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
         
        </div>
        <footer className="mt-4 border-t border-black pt-8 pb-8">
          <div className="flex flex-wrap gap-4">
            <h1 className="text-xl font-semibold">REPLACEMENT COMPONENT</h1>
          </div>
        </footer>
      </div>
    </div>
  );
}
