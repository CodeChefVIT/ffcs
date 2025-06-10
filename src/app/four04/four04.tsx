
"use client"

import useScreenSize from "@/hooks/useScreenSize";
import Four04Mobile from '@/app/four04/four04-mobile'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';


export default function NotFound() {
  const size = useScreenSize();
  const router = useRouter();

  if (size === 'mobile') {
    return <Four04Mobile />;
  }

  // Desktop (default) version
  return (
    <>
      <header> </header>
      <section className="w-full h-screen relative">
        <Image
          src="/bgffcs.jpg"
          alt="Background of ffcs page"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1
            className="text-[120px] font-extrabold text-blue-300"
            style={{
              textShadow: `
              -5px -5px 0 black,
              5px -5px 0 black,
              -5px 5px 0 black,
              13px 5px 0 black,
              1px 0px 10px black
            `
            }}
          >
            404
          </h1>
          <h2 className="text-2xl font-mono font-Pangolin text-black mb-5"
            style={{ fontFamily: 'Pangolin, cursive' }}
          >
            OOPS! You have found this secret page! We have nothing to show here...
          </h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 flex items-center gap-x-2 border-t-2 border-l-2 border-r-5 border-b-5 border-t-black border-l-black border-r-black border-b-gray-800 bg-blue-300 text-black font-semibold rounded-lg hover:bg-blue-600 transition"
          >HOME<Home size={18} className="text-black" />

          </button>

        </div>
      </section>
      <footer> </footer>

    </>

  );
}
