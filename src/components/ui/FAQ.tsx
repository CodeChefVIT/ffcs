"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FAQProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

export default function FAQ({ question, answer, isOpen, onToggle }: FAQProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) setMaxHeight(`${contentRef.current.scrollHeight}px`);
    else setMaxHeight("0px");
  }, [isOpen]);

  return (
    <div className={`
        w-72 sm:w-128 md:w-196 lg:w-5xl
        border-b flex flex-col justify-start
        pt-4 pb-4 rounded-3xl border-3
        border-black cursor-pointer
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4
        ${isOpen ? "bg-[#A7D5D7]/57" : "bg-white/60"}
      `}
      onClick={onToggle}
    >

      <div className="group flex flex-row justify-between items-center w-full cursor-pointer font-poppins" >
        <div className="font-poppins text-xs md:text-md lg:text-lg font-semibold mr-6 text-black/80">
          {question}
        </div>
        {isOpen
          ? (<ChevronUp className="cursor-pointer text-2xl text-black/80" />)
          : (<ChevronDown className="cursor-pointer text-2xl text-black/80" />)
        }
      </div>

      <div className="transition-all duration-500 ease-in-out overflow-hidden" style={{ maxHeight }} >
        <div ref={contentRef}>
          <p className="font-poppins font-normal text-xs md:text-md lg:text-lg mr-6 pt-4 text-black/80">
            {answer}
          </p>
        </div>
      </div>

    </div>
  );
};
