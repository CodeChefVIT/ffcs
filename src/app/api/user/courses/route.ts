import dbConnect from "@/app/lib/db";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const userEmail = req.headers.get("email");

  if (body.courseNo < 0) {
    return NextResponse.json(
      { message: "Invalid course number" },
      { status: 400 }
    );
  }

  try {
    // Find user by email
    const user = await User.findOne({ userEmail });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (body._id) {
      user.savedCourseData[body.courseNo] = user.savedCourseData[
        body.courseNo
      ].filter(
        (faculty: { _id: string }) => faculty._id.toString() !== body._id
      );
    } else if (body.faculty && body.facultySlots) {
      if (!user.savedCourseData[body.courseNo]) {
        user.savedCourseData[body.courseNo] = [];
      }
      user.savedCourseData[body.courseNo].push({
        faculty: body.faculty,
        facultySlot: body.facultySlots,
      });
    } else {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Update the user data in the database
    const updatedUser = await User.findOneAndUpdate(
      { userEmail },
      { savedCourseData: user.savedCourseData },
      { new: true }
    );

    return NextResponse.json({
      message: body._id ? "Faculty removed" : "Faculty added",
      data: updatedUser.savedCourseData[body.courseNo],
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed", error },
      { status: 500 }
    );
  }
}
