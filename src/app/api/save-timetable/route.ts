import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Timetable from "@/models/timetable";
import { generateShareId } from "@/lib/shareIDgenerate";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const { title, slots, owner, isPublic } = body;

  if (!title || !slots || !owner) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    let shareId: string;
    let exists = true;
    do {
      shareId = generateShareId();
      exists = !!(await Timetable.exists({ shareId }));
    } while (exists);

    const timetable = await Timetable.create({
      title,
      slots,
      owner,
      isPublic: isPublic ?? false,
      shareId,
    });
    return NextResponse.json({ success: true, timetable });
  } catch {
    return NextResponse.json({ error: "Failed to save timetable" }, { status: 500 });
  }
}