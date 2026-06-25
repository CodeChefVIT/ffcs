import Image from 'next/image';
import { ZButton } from '../ui/Buttons';
//import { useRouter } from 'next/navigation';

export default function Hero() {
  return (
    <div className="relative w-320 h-150 md:h-180 flex justify-center items-center font-pangolin text-black isolate">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-16 h-16 left-100 top-108 md:w-24 md:h-24 md:left-80 md:top-115 absolute rotate-[-60deg]">
          <Image
            src="/art/art_rice.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-16 h-16 top-55 right-100 md:w-24 md:h-24 md:top-50 md:right-90 absolute rotate-[-15deg]">
          <Image
            src="/art/art_boom.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-36 h-36 top-50 left-50 md:w-48 md:h-48 md:top-50 md:left-32 absolute">
          <Image
            src="/art/art_paper.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-42 h-42 top-60 right-58 md:w-64 md:h-64 md:top-50 md:right-32 absolute">
          <Image
            src="/art/art_plane.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-12 h-12 top-110 left-64 md:w-16 md:h-16 md:top-130 md:left-37 absolute">
          <Image
            src="/art/letter_c.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-12 h-12 top-50 left-100 md:w-16 md:h-16 md:top-50 md:left-100 absolute">
          <Image
            src="/art/letter_h.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-12 h-12 top-107 right-96 md:w-16 md:h-16 md:top-107 md:right-70 absolute">
          <Image
            src="/art/letter_e.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-12 h-12 top-120 right-70 md:w-16 md:h-16 md:top-132 md:right-30 absolute">
          <Image
            src="/art/letter_f.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-12 h-12 top-220 left-8 md:w-16 md:h-16 md:top-220 md:left-8 absolute">
          <Image
            src="/art/letter_i.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-12 h-12 top-300 left-23 md:w-16 md:h-16 md:top-300 md:left-23 absolute">
          <Image
            src="/art/letter_m.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>

        <div className="w-12 h-12 top-263 right-12 md:w-16 md:h-16 md:top-263 md:right-12 absolute">
          <Image
            src="/art/letter_k.svg"
            alt=""
            fill
            className="select-none"
            draggable={false}
            priority
          />
        </div>
      </div>

      <div className="absolute left-1/2 top-36 w-full transform -translate-x-1/2 flex flex-col items-center text-center z-20">
        <Image
          src="/logo_ffcs.svg"
          alt=""
          width={96}
          height={96}
          className="mx-auto w-24 h-24 md:w-32 md:h-32 mb-6 select-none"
          draggable={false}
          priority
        />

        <div className="text-5xl md:text-6xl mb-6">FFCS-inator</div>

        <div className="text-2xl md:text-3xl mb-8">Create Your Ideal Timetable!</div>

        <ZButton
          type="large"
          text="Start"
          image="/icons/arrow_down.svg"
          color="purple"
          onClick={() => {
            const el = document.getElementById('start');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>
    </div>
  );
}
