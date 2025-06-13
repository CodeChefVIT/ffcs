'use client';

import { useState } from 'react';
import Image from 'next/image';

const schools = ['SCOPE', 'SELECT', 'SCORE', 'SMEC', 'SBST', 'SCHEME', 'SENSE', 'SCE'];

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

type FacultySelectorProps = {
  domains: string[];
  subjects: string[];
  slots: string[];
  faculties: string[];
  onConfirm: (selection: {
    domain: string;
    subject: string;
    slot: string;
    priorityList: string[];
  }) => void;
  onReset: () => void;
};


const SelectField = ({ label, value, options, onChange, }: SelectFieldProps) => {

  return <div className="relative ">

    <select
      className="w-full p-2 pl-3 pr-10 rounded-xl border-3 border-black bg-white font-semibold text-[#000000B2] outline-none appearance-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >

      <option value="">{`Select ${label}:`}</option>

      {options.map((option, index) => (
        <option key={`${index}+${option}`} value={option}>
          {option}
        </option>
      ))}

    </select>

    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-xl pointer-events-none">
      <Image src="/icons/chevron_down.svg" alt="icon" className="w-5 h-5" width={120} height={80} />
    </div>

    <div className="absolute right-11 top-0 h-full w-[3px] bg-black" />

  </div>

};


export default function FacultySelector({ domains = [], subjects = [], slots = [], faculties = [], onConfirm, onReset, }: FacultySelectorProps) {

  const [selectedSchool, setSelectedSchool] = useState('SMEC');
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [priorityList, setPriorityList] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleReset = () => {
    setSelectedDomain('');
    setSelectedSubject('');
    setSelectedSlot('');
    setSelectedFaculties([]);
    setPriorityList([]);
    onReset();
  };

  const handleConfirm = () => {
    onConfirm({
      domain: selectedDomain,
      subject: selectedSubject,
      slot: selectedSlot,
      priorityList,
    });
  };

  // Toggle faculty selection and sync with priority list
  const toggleFaculty = (name: string) => {
    setSelectedFaculties(prev => {
      const updated = prev.includes(name)
        ? prev.filter(f => f !== name)
        : [...prev, name];

      setPriorityList(prevPriority => {
        const updatedPriority = updated.map(faculty =>
          prevPriority.includes(faculty) ? faculty : faculty
        );
        return updatedPriority;
      });

      return updated;
    });
  };

  // Move priority item up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...priorityList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setPriorityList(newList);
  };

  // Move priority item down
  const moveDown = (index: number) => {
    if (index === priorityList.length - 1) return;
    const newList = [...priorityList];
    [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
    setPriorityList(newList);
  };

  return <div>
    {/* Custom scrollbar styles */}
    <style>{`
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #9ca3af; border-radius: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background-color: transparent; }
            `}</style>

    {/* Main container */}
    <div className="relative inline-block mb-20">
      <div className="absolute inset-0 bg-black rounded-xl translate-x-1.5 translate-y-1.5 z-0" />

      <div className="font-poppins relative bg-[#A7D5D7] rounded-xl max-w-[51rem] border border-black border-l-[3px] border-t-[3px] mx-auto overflow-hidden">

        {/* School selector buttons */}
        <div className="flex items-center flex-wrap gap-2 mb-4 pt-4 px-4">
          <span className="font-semibold text-lg">Select School:</span>
          {schools.map((school) => (
            <button
              key={school}
              onClick={() => setSelectedSchool(school)}
              className={`px-3 py-1 rounded-full border-2 text-sm font-semibold border-black border-r-[4px] border-b-[4px] ${selectedSchool === school ? 'bg-[#FFEA79]' : 'bg-white hover:bg-gray-200'}`}
            >
              {school}
            </button>
          ))}
        </div>

        {/* Filters: Domain, Subject, Slot */}
        <div className="grid grid-cols-3 gap-4 mb-4 px-4">
          <SelectField label={'Domain'} value={selectedDomain} options={domains} onChange={setSelectedDomain} />
          <SelectField label="Subject" value={selectedSubject} options={subjects} onChange={setSelectedSubject} />
          <SelectField label="Slot" value={selectedSlot} options={slots} onChange={setSelectedSlot} />
        </div>

        {/* Divider */}
        <div className="w-full h-[4px] bg-black mb-4" />

        {/* Faculties & Priority */}
        <div className="grid grid-cols-2 gap-4 px-4 pb-4 h-full">
          {/* Faculty selection list */}
          <div className="bg-[#FBFDFC66] rounded-xl overflow-hidden flex flex-col">
            <div className="bg-[#FFFFFF99] text-center text-[#000000B2] p-4 font-semibold text-lg">Select Faculties</div>
            <div className="pt-4 pb-4 px-6 overflow-y-auto space-y-2 scrollbar-thin h-86">
              {faculties.map((faculty, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between py-1">
                    <span className='text-[#000000B2]'>{faculty}</span>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFaculties.includes(faculty)}
                        onChange={() => toggleFaculty(faculty)}
                        className="peer hidden"
                      />
                      <div className="w-7 h-7 rounded-md border-2 border-black flex items-center justify-center peer-checked:bg-[#C1FF83] peer-checked:before:content-['✔'] peer-checked:before:text-black peer-checked:before:text-sm peer-checked:before:font-bold" />
                    </label>
                  </div>
                  <div className="w-full h-[1px] bg-black mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Faculty priority list and buttons */}
          <div className="flex flex-col h-full justify-between">
            <div className="bg-[#FBFDFC66] rounded-xl overflow-hidden mb-4">
              <div className="bg-[#FFFFFF99] text-center text-[#000000B2] p-4 font-semibold text-lg">Faculty Priority</div>
              <div className="h-64 overflow-y-auto space-y-2 pb-4 pt-4 px-6 scrollbar-thin">
                {priorityList.map((faculty, index) => (
                  <div
                    key={index}
                    className="group cursor-move"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const fromIndex = Number(e.dataTransfer.getData('text/plain'));
                      if (fromIndex === index) return;

                      const updatedList = [...priorityList];
                      const [movedItem] = updatedList.splice(fromIndex, 1);
                      updatedList.splice(index, 0, movedItem);
                      setPriorityList(updatedList);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[#000000B2]">{faculty}</span>
                      <div className="flex flex-col items-center gap-1 bg-[#FFFFFF80] px-2 py-1 rounded-lg">
                        <button onClick={() => moveUp(index)} className="text-sm text-black">
                          <Image src={index !== 0 ? "/icons/chevron_up.svg" : "/icons/chevron_up_gray.svg"} width={120}
                            height={80} alt="up" className="w-3 h-3" />
                        </button>
                        <button onClick={() => moveDown(index)} className="text-sm text-black">
                          <Image width={120}
                            height={80} src={index !== priorityList.length - 1 ? "/icons/chevron_down.svg" : "/icons/chevron_down_gray.svg"} alt="down" className={`w-3 h-3`} />
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-black mt-1" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-red-500 p-3 text-center font-semibold">
                *Use arrows or drag-drop to set faculty priority.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between gap-4">
              {/* Reset */}
              <div className="relative flex-1">
                <div className="absolute inset-0 bg-black rounded-lg translate-x-1 translate-y-1 z-0"></div>
                <button
                  onClick={handleReset}
                  className="relative z-10 w-full flex items-center cursor-pointer justify-around gap-2 bg-[#ffb3a7] hover:bg-[#ffa08e] border-2 border-black px-4 py-2 rounded-lg font-semibold border-l-[3px] border-t-[3px]"
                >
                  Reset <Image src="/icons/reset.svg" alt="reset" className="w-5 h-5" width={120}
                    height={80} />
                </button>
              </div>

              {/* Confirm */}
              <div className="relative flex-1">
                <div className="absolute inset-0 bg-black rounded-lg translate-x-1 translate-y-1 z-0"></div>
                <button onClick={handleConfirm}
                  className="relative z-10 w-full cursor-pointer flex items-center justify-around gap-2 bg-lime-300 hover:bg-lime-400 border-2 border-black px-4 py-2 rounded-lg font-semibold border-l-[3px] border-t-[3px]"
                >
                  Confirm <Image src="/icons/check.svg" alt="confirm" className="w-5 h-5" width={120} height={80} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}
