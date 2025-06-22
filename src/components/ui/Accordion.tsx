"use client";

import FAQ from "./FAQ";
import faqList from "@/data/faq";

const Accordion = () => {
  return (
    <div className="text-black w-full max-w-6xl flex flex-col gap-8 lg:mx-16 md:mx-4 xl:mx-auto items-center my-16 sm:mt-0 sm:mb-32 font-semibold">
      <h1 className="font-bold text-3xl text-center">
        Frequently Asked Questions
      </h1>
      {faqList.map((faq, index) => (
        <FAQ key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default Accordion;
