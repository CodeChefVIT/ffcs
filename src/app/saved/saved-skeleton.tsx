import Image from 'next/image';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export function SavedTimetablesSkeleton() {
  return (
    <div role="status" aria-label="Loading saved timetables">
      <span className="sr-only">Loading saved timetables...</span>
      <ul
        aria-hidden="true"
        className="w-full space-y-4 px-6 sm:px-0 sm:max-h-[60vh] sm:overflow-y-auto sm:pr-4"
      >
        {[0, 1, 2, 3].map(index => (
          <li
            key={index}
            className="flex items-center justify-between gap-4 px-3 py-3 bg-[#A7D5D7] rounded-xl border-2 border-black shadow-[2px_2px_0_0_black] sm:bg-[#C9E5E6] sm:p-5 sm:rounded-4xl sm:border-0 sm:shadow-none"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4 motion-safe:animate-pulse">
              <span className="h-6 w-4 shrink-0 rounded bg-black/10 sm:h-7 sm:w-6" />
              <span
                className={`h-4 rounded bg-black/10 sm:h-6 ${index % 2 === 0 ? 'w-1/2' : 'w-2/3'}`}
              />
            </div>
            <div className="hidden gap-2 motion-safe:animate-pulse sm:flex" aria-hidden="true">
              {[0, 1, 2].map(action => (
                <span
                  key={action}
                  className="h-13 w-13 rounded-xl border-3 border-black/20 bg-black/10 shadow-[4px_4px_0_0_#00000033]"
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SavedPageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen relative select-none">
      <div className="absolute inset-0 -z-10 bg-[#CEE4E5]">
        <Image
          src="/art/bg_dots.svg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-top object-contain"
        />
      </div>
      <div className="sm:hidden">
        <Navbar page="mobile" />
      </div>
      <div className="hidden sm:block">
        <Navbar page="saved" />
      </div>
      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-4xl mt-28 mb-8 font-pangolin sm:text-6xl sm:mt-48 sm:mb-16">
          Saved Timetables
        </h1>
        <div className="w-full sm:w-5/6 sm:max-w-7xl sm:rounded-[60px] sm:border-4 sm:border-black sm:bg-[#A7D5D7] sm:p-12 sm:mb-24 sm:shadow-[4px_4px_0_0_black]">
          <h2 className="hidden sm:block text-4xl mb-8 font-pangolin font-light">All Timetables</h2>
          <SavedTimetablesSkeleton />
        </div>
      </div>
      <div className="sm:hidden">
        <Footer type="mobile" />
      </div>
      <div className="hidden sm:block">
        <Footer />
      </div>
    </div>
  );
}
