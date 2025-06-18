"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import CompoundTable from "@/components/ui/CompoundTable";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

type dataProps = {
  code: string;
  slot: string;
  name: string;
};

export default function SharedTimetablePage() {
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
    <div className="flex flex-col min-h-screen relative select-none">
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

      <Navbar page="shared" />

      <div className="flex-1 flex flex-col items-center mb-16">
        <div className="text-5xl mt-48 mb-8 font-pangolin text-black">
          {title ? title : "Shared Timetable"}
        </div>
        {data && (
          <div className="w-full max-w-7xl overflow-x-auto">
            <CompoundTable data={data} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}