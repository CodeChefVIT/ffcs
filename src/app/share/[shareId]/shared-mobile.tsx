"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import CompoundTable from "@/components/ui/CompoundTable";
import Footer from "@/components/ui/Footer";;

type dataProps = {
  code: string;
  slot: string;
  name: string;
};

export default function SharedTimetablePageMobile() {
  const router = useRouter();
  const params = useParams();
  const shareId =
    typeof params.shareId === "string"
      ? params.shareId
      : Array.isArray(params.shareId)
        ? params.shareId[0]
        : undefined;

  const [data, setData] = useState<dataProps[] | null>(null);
  const [title, setTitle] = useState<string>("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!shareId) return;
    axios
      .get(`/api/shared-timetable/${shareId}`)
      .then((res) => {
        const json = res.data;
        if (json && json.timetable && Array.isArray(json.timetable.slots)) {
          setTitle(json.timetable.title || "");
          setData(
            json.timetable.slots.map((item: { courseCode: string; slot: string; facultyName: string }): dataProps => ({
              code: item.courseCode,
              slot: item.slot,
              name: item.facultyName,
            }))
          );
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [shareId]);

  if (notFound) {
    router.push("/404");
  }

  return (
    <div className="flex flex-col min-h-screen relative items-center font-poppins">
      <div className="absolute inset-0 -z-10 bg-[#CEE4E5]">
        <Image
          src="/art/bg_dots.svg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-top object-contain w-full h-full"
          unselectable="on"
          draggable={false}
        />
      </div>

      <div onClick={() => router.push('/')}>
        <Image
          src="/logo_ffcs.svg"
          alt="FFCS Logo"
          width={60}
          height={60}
          className="cursor-pointer mt-8 mb-8"
          unselectable="on"
          draggable={false}
          priority
        />
      </div>

      <div className="text-4xl mb-8 text-black font-pangolin">
        {title ? title : "Shared Timetable"}
      </div>
      {data && (
        <div className="w-full max-w-7xl overflow-x-auto mb-8">
          <CompoundTable data={data} />
        </div>
      )}

      <Footer type="mobile" />

    </div>
  );
}
