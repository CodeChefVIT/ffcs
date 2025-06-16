import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Timetable from "@/models/timetable";

export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = await context.params; 

  try {
    await Timetable.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = await context.params;
  const { title } = await req.json();

  try {
    await Timetable.findByIdAndUpdate(id, { title });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to rename" }, { status: 500 });
  }
};
