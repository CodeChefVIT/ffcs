'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZButton } from './ui/Buttons';

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
  return <div className="relative">
    <select
      className="w-full p-2 pl-3 pr-10 rounded-xl border-3 border-black bg-white font-semibold text-[#000000B2] outline-none appearance-none cursor-pointer"
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
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-xl pointer-events-none cursor-pointer">
      <Image src="/icons/chevron_down.svg" alt="icon" className="w-5 h-5" width={120} height={80} />
    </div>
    <div className="absolute right-11 top-0 h-full w-[3px] bg-black" />
  </div>
};


export default function FacultySelector({ domains = [], subjects = [], slots = [], faculties = [], onConfirm, onReset, }: FacultySelectorProps) {

  const [selectedSchool, setSelectedSchool] = useState('SCOPE');
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

    {/* Main container */}
    <div className="relative inline-block mb-20">

      <div className="font-poppins relative bg-[#A7D5D7] rounded-4xl border-3 border-black shadow-[4px_4px_0_0_black] mx-auto overflow-hidden">

        {/* School selector buttons */}
        <div className="flex items-center gap-4 pt-4 px-4 m-4">
          <span className="font-semibold text-lg mr-2">Select School:</span>
          {schools.map((school) => (
            <button
              key={school}
              onClick={() => setSelectedSchool(school)}
              className={`
                px-3 py-1
                rounded-full
                text-sm font-bold
                border-2
                shadow-[2px_2px_0_0_black]
                border-black
                cursor-pointer
                transition duration-100
                active:shadow-[1px_1px_0_0_black]
                active:translate-x-[1px]
                active:translate-y-[1px]
                ${selectedSchool === school ? 'bg-[#FFEA79]' : 'bg-white'}
              `}
            >
              {school}
            </button>
          ))}
        </div>

        {/* Filters: Domain, Subject, Slot */}
        <div className="grid grid-cols-3 gap-4 m-4 px-4">
          <SelectField label={'Domain'} value={selectedDomain} options={domains} onChange={setSelectedDomain} />
          <SelectField label="Subject" value={selectedSubject} options={subjects} onChange={setSelectedSubject} />
          <SelectField label="Slot" value={selectedSlot} options={slots} onChange={setSelectedSlot} />
        </div>

        {/* Divider */}
        <div className="w-full h-[2px] bg-black mt-6 mb-6" />

        {/* Faculties & Priority */}
        <div className="grid grid-cols-2 gap-4 px-4 pb-4 h-full m-4">

          {/* Faculty selection list */}
          <div className="bg-[#FFFFFF]/40 rounded-xl overflow-hidden flex flex-col">
            <div className="bg-[#FFFFFF]/60 text-center text-[#000000]/80 p-4 font-semibold text-lg">Select Faculties</div>
            <div className="pt-4 pb-4 px-6 overflow-y-auto space-y-2 scrollbar-thin h-86">
              {faculties.map((faculty, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className='text-[#000000]'>{faculty}</span>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFaculties.includes(faculty)}
                        onChange={() => toggleFaculty(faculty)}
                        className="peer hidden"
                      />
                      <div className="w-7 h-7 rounded-md border-3 border-black flex items-center justify-center peer-checked:bg-[#C1FF83]">
                        <Image
                          src={selectedFaculties.includes(faculty) ? "/icons/check.svg" : "/icons/blank.svg"}
                          alt="check" className="w-7 h-7" width={32} height={32} />
                      </div>
                    </label>
                  </div>
                  <div className="w-full mt-1 bg-black" style={{ height: `${1 / window.devicePixelRatio}px` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Faculty priority list and buttons */}
          <div className="flex flex-col h-full justify-between">

            <div className="bg-[#FFFFFF]/40 rounded-xl overflow-hidden mb-4">
              <div className="bg-[#FFFFFF]/60 text-center text-[#000000]/80 p-4 font-semibold text-lg">Faculty Priority</div>
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
                    <div className="flex justify-between items-center px-2">
                      <div>
                        <span className="text-[#000000] mr-5 font-inter font-semibold">{index + 1}.</span>
                        <span className="text-[#000000]">{faculty}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 bg-[#FFFFFF]/50 px-2 py-1 rounded-lg">
                        <button onClick={() => moveUp(index)} className="text-sm text-black cursor-pointer">
                          <Image src={index !== 0 ? "/icons/chevron_up.svg" : "/icons/chevron_up_gray.svg"} width={120}
                            height={80} alt="up" className="w-3 h-3" />
                        </button>
                        <button onClick={() => moveDown(index)} className="text-sm text-black cursor-pointer">
                          <Image width={120}
                            height={80} src={index !== priorityList.length - 1 ? "/icons/chevron_down.svg" : "/icons/chevron_down_gray.svg"} alt="down" className={`w-3 h-3`} />
                        </button>
                      </div>
                    </div>
                    <div className="w-full mt-1 bg-black" style={{ height: `${1 / window.devicePixelRatio}px` }} />
                  </div>
                ))}
              </div>
              <div className="text-xs text-[#CC3312] p-3 text-center font-semibold">*Use arrows or drag-drop to set faculty priority.</div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4">
              <ZButton type="long" text="Reset" image="icons/reset.svg" onClick={handleReset} color="red" />
              <ZButton type="long" text="Confirm" image="icons/check.svg" onClick={handleConfirm} color="green" />
            </div>

          </div>

        </div>

      </div>
    </div>
  </div>
}
