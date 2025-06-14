"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import CompoundTable from "@/components/ui/CompoundTable";
import Footer from "@/components/ui/Footer";

type dataProps = {
  code: string;
  slot: string;
  name: string;
}

const idMap: Record<string, dataProps[]> = {
  'ABC123': [
    { code: "BBRT101L", slot: "TG1", name: "Mansi Sharma" },
    { code: "BBRT101P", slot: "L21+L22", name: "Mansi Sharma" },
    { code: "BBIT101L", slot: "A1+TA1", name: "Samya Mehta" },
    { code: "BBIT101P", slot: "L31+L32", name: "Samya Mehta" },
    { code: "BERT101L", slot: "B1", name: "Yashita Puri" },
    { code: "BERT101P", slot: "L59+L60", name: "Yashita Puri" },
    { code: "BBRT101L", slot: "C1", name: "Kuriak Tom Jacob" },
    { code: "BBRT101P", slot: "L43+L44", name: "Kuriak Tom Jacob" },
    { code: "BBRT101L", slot: "D1", name: "Abhinav Pant" },
    { code: "BBRT101L", slot: "F1+TF1", name: "Ishan Jindal" },
    { code: "BBRT101P", slot: "L47+L48", name: "Ishan Jindal" },
    { code: "TEST101K", slot: "F2", name: "Test TT 1" },
  ],
  'DEF456': [
    { code: "BBRT101L", slot: "TG1", name: "Mansi Sharma" },
    { code: "BBRT101P", slot: "L21+L22", name: "Mansi Sharma" },
    { code: "BBIT101L", slot: "A1+TA1", name: "Samya Mehta" },
    { code: "BBIT101P", slot: "L31+L32", name: "Samya Mehta" },
    { code: "BERT101L", slot: "B1", name: "Yashita Puri" },
    { code: "BERT101P", slot: "L59+L60", name: "Yashita Puri" },
    { code: "BBRT101L", slot: "C1", name: "Kuriak Tom Jacob" },
    { code: "BBRT101P", slot: "L43+L44", name: "Kuriak Tom Jacob" },
    { code: "BBRT101L", slot: "D1", name: "Abhinav Pant" },
    { code: "BBRT101L", slot: "F1+TF1", name: "Ishan Jindal" },
    { code: "TEST101K", slot: "F2", name: "Test TT 2" },
  ],
  'GHI789': [
    { code: "BBRT101L", slot: "TG1", name: "Mansi Sharma" },
    { code: "BBRT101P", slot: "L21+L22", name: "Mansi Sharma" },
    { code: "BBIT101L", slot: "A1+TA1", name: "Samya Mehta" },
    { code: "BBIT101P", slot: "L31+L32", name: "Samya Mehta" },
    { code: "BERT101L", slot: "B1", name: "Yashita Puri" },
    { code: "BERT101P", slot: "L59+L60", name: "Yashita Puri" },
    { code: "BBRT101L", slot: "C1", name: "Kuriak Tom Jacob" },
    { code: "BBRT101P", slot: "L43+L44", name: "Kuriak Tom Jacob" },
    { code: "BBRT101L", slot: "D1", name: "Abhinav Pant" },
    { code: "BBRT101L", slot: "F1+TF1", name: "Ishan Jindal" },
    { code: "TEST101K", slot: "F2", name: "Test TT 3" },
  ],
}

export default function View() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id')?.toUpperCase();

  if (!id || !idMap[id]) {
    router.push('/404');
  }

  return <div className="flex flex-col min-h-screen relative items-center font-poppins">
    <div className="absolute inset-0 -z-10 bg-[#CEE4E5]">
      <Image
        src="/art/bg_dots.svg"
        alt="Background"
        fill
        priority
        sizes="100vw"
        className="object-top object-contain w-full h-full"
      />
    </div>

    <div onClick={() => router.push('/')}>
      <Image
        src="/logo_ffcs.svg"
        alt="FFCS Logo"
        width={60}
        height={60}
        className="cursor-pointer mt-8 mb-8"
      />
    </div>
    <div className="text-4xl mb-8 text-black font-pangolin">Shared Timetable</div>

    {id && idMap[id] && (
      <div className="w-full max-w-7xl overflow-x-auto mb-8">
        <CompoundTable data={idMap[id] ?? []} />
      </div>
    )}

    <Footer type="mobile" />

  </div>
}
