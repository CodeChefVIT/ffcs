import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Timetable from "@/models/timetable";

export async function GET(req: NextRequest) {
  await dbConnect();

  // Get shareId from the URL
  const shareId = req.nextUrl.pathname.split("/").pop();

  if (!shareId) {
    return NextResponse.json({ error: "Missing shareId" }, { status: 400 });
  }

  try {
    const timetable = await Timetable.findOne({ shareId });

    if (!timetable || !timetable.isPublic) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      timetable: {
        title: timetable.title,
        slots: timetable.slots,
        owner: timetable.owner,
        shareId: timetable.shareId,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}