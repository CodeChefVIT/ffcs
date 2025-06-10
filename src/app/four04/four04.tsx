"use client"

import Image from "next/image";
import { LargeButton } from "@/components/ui/Buttons";

export default function NotFound() {


  return (

    <div className="relative w-full">
      <Image
        src="/bgffcs.jpg"
        alt="Background"
        width={0}
        height={0}
        className="w-full h-auto object-top object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-x-0 top-40 flex flex-col items-center text-center">
        <div className="relative">
          {/* 45° Shadow layer */}
          <span
            className="absolute inset-0 select-none pointer-events-none"
            style={{
              fontFamily: "'Poppins', sans-serif",
              WebkitTextStroke: '16px black',
              color: 'black',
              fontSize: '160px',
              fontWeight: 800,
              left: 8,
              top: 8,
              zIndex: 0,
            }}
          >
            404
          </span>
          {/* Stroke layer */}
          <span
            className="absolute inset-0 select-none pointer-events-none"
            style={{
              fontFamily: "'Poppins', sans-serif",
              WebkitTextStroke: '16px black',
              color: 'transparent',
              fontSize: '160px',
              fontWeight: 800,
              left: 0,
              top: 0,
              zIndex: 1,
            }}
          >
            404
          </span>
          {/* Fill layer */}
          <span
            className="relative select-none pointer-events-none"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: '#90BDFF',
              fontSize: '160px',
              fontWeight: 800,
              zIndex: 2,
            }}
          >
            404
          </span>
        </div>

        <h2 className="text-3xl mb-8" style={{ fontFamily: "'Pangolin', cursive", color: 'black' }}>
          OOPS! You have found this secret page!<br />
          We have nothing to show here...
        </h2>

        <LargeButton
          text="Home"
          color="purple"
          image="/icon_home.svg"
          onClick={() => { window.location.href = '/'; }}
        />

      </div>
    </div >
  );
}
