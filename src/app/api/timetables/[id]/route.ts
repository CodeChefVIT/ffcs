import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Timetable from "@/models/timetable";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");

  if (!owner) {
    return NextResponse.json({ error: "Missing owner" }, { status: 400 });
  }

  try {
    const timetables = await Timetable.find({ owner }).lean();
    return NextResponse.json(timetables, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch timetables" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = context.params;
  try {
    await Timetable.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = context.params;
  const { title } = await req.json();
  try {
    await Timetable.findByIdAndUpdate(id, { title });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to rename" }, { status: 500 });
  }
}