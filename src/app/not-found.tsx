"use client";

import useScreenSize from "@/hooks/useScreenSize";
import Four04Mobile from "@/app/four04/four04-mobile";
import Four04 from "./four04/four04";
import Loader from "@/components/ui/Loader";

export default function NotFound() {
  const size = useScreenSize();

  if (size === null) return <Loader />;
  if (size === "mobile") return <Four04Mobile />;
  return <Four04 />;
}
