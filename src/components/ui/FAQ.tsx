"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FAQProps = {
  question: string;
  answer: string;
};

const FAQ = ({ question, answer }: FAQProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

  return (
    <div className="w-72 sm:w-128 md:w-196 lg:w-5xl border-b flex flex-col justify-start pt-4 pb-4 rounded-xl border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 bg-white">
      <div
        className="group flex flex-row justify-between items-center w-full cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <>
            <p className="font-small text-xs md:text-md lg:text-lg lg:font-semibold mr-6 text-[#438eff]">
              {question}
            </p>
            <ChevronUp className="cursor-pointer text-2xl text-[#438eff]" />
          </>
        ) : (
          <>
            <p className="font-small text-xs md:text-md lg:text-lg lg:font-semibold mr-6">
              {question}
            </p>
            <ChevronDown className="cursor-pointer text-2xl" />
          </>
        )}
      </div>
      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight }}
      >
        <div ref={contentRef}>
          <p className="font-small text-xs md:text-md lg:text-lg lg:font-semibold mr-6 pt-4">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
