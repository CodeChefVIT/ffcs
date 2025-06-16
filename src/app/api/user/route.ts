import dbConnect from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();
  const email = req.headers.get("email");

  try {
    const user = await User.findOne({ email: email }, { savedCourseData: 1 });
    if (user) {
      return NextResponse.json({
        savedCourseData: user.savedCourseData,
      });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { email, userName, ...rest } = body;
    if (!email || !userName) {
      return NextResponse.json(
        { message: "Missing email or userName" },
        { status: 400 }
      );
    }
    const user = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: { email, userName }, $set: { ...rest } },
      { upsert: true, new: true }
    );
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error upserting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
