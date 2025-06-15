import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Timetable from "@/models/timetable";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const { title, slots, owner } = body;

  if (!title || !slots || !owner) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const timetable = await Timetable.create({
      title,
      slots,
      owner,
      isPublic: false,
    });
    return NextResponse.json({ success: true, timetable });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save timetable" }, { status: 500 });
  }
}