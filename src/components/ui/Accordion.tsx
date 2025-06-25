"use client";

import FAQ from "./FAQ";
import faqList from "@/data/faq";
import React, { useState } from "react";

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="text-black w-full max-w-6xl flex flex-col gap-8 lg:mx-16 md:mx-4 xl:mx-auto items-center my-16 sm:mt-16 sm:mb-0 font-semibold">
      <h1 className="font-bold text-3xl text-center font-poppins mb-4">
        Frequently Asked Questions
      </h1>
      {faqList.map((faq, index) => (
        <FAQ
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};
