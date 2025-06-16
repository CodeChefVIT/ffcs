import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Timetable from "@/models/timetable";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = (await context).params;

  try {
    await Timetable.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = (await context).params;
  const body = await req.json();
  const update: any = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.isPublic !== undefined) update.isPublic = body.isPublic;
  try {
    await Timetable.findByIdAndUpdate(id, update);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = (await context).params;
  try {
    const timetable = await Timetable.findById(id).lean();
    if (!timetable) {
      return NextResponse.json(
        { error: "Timetable not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(timetable, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch timetable" },
      { status: 500 }
    );
  }
}
