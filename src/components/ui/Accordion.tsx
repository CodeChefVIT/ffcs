"use client;"

import FAQ from "./FAQ";

const faqList = [
  {
    question: "What is the purpose of this website?",
    answer:
      "This platform helps VIT students visualize and manage their FFCS timetables more efficiently. It simplifies the course selection process and offers tools to compare and plan schedules."
  },
  {
    question: "Can we share timetables?",
    answer:
      "Yes, after generating a timetable, you can share it using a unique link. This makes it easy to collaborate with friends."
  },
  {
    question: "How do I use the website?",
    answer:
      "Start by selecting your preferences such as course, faculty, and slot. The platform will generate all possible timetables for you. You can filter, view, and share any of them with ease."
  },
  {
    question: "Do I need to log in to use the platform?",
    answer:
      "No login is required. You can use all features anonymously, you only need to login in order to save your timetable."
  },
  {
    question: "Is this affiliated with VIT University?",
    answer:
      "No, this is an independent student-made tool created by the CodeChef-VIT to assist students during FFCS."
  },
  {
    question: "Will this work for all campuses?",
    answer:
      "Currently, the tool is optimized for VIT Vellore. Compatibility for other campuses may be added in future versions."
  }
];



const Accordion = () => {
  return (
    <div className="text-black w-full max-w-6xl flex flex-col gap-8 lg:mx-16 md:mx-4 xl:mx-auto items-center my-16 sm:mt-0 sm:mb-32 font-semibold">
      <h1 className="font-bold text-3xl text-center">Frequently Asked Questions</h1>
      {faqList.map((faq, index) => (
        <FAQ key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  ); 
};

export default Accordion;
