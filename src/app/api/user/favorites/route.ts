import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/user";

import mongoose from "mongoose";


// GET request to retrieve user's favourites using email
export async function GET(req: NextRequest) {
  await dbConnect();
//   const session: { user: { email: string } } | null = await getServerSession(
//     authOptions
//   );

//   const email = session?.user.email;

  

    const email = req.headers.get("email");
    console.log("Received email:", email);
    if (!email) {
        return NextResponse.json(
          { message: "Favourites retrieval failed: User not authenticated" },
          { status: 401 }
        );
      }

  try {
    const user = await User.findOne({ email: email }, { favourites: 1 });

    if (!user) {
      return NextResponse.json(
        { message: "Favourites retrieval failed: User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Favourites retrieved successfully",
      favourites: user.favourites,
    });
  } catch (error) {
    console.error("Error retrieving favourites:", error);
    return NextResponse.json(
      { message: "Favourites retrieval failed due to server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
//   const session: { user: { email: string } } | null = await getServerSession(
//     authOptions
//   );

//   const email = session?.user.email;

//   if (!email) {
//     return NextResponse.json(
//       { message: "Favourites retrieval failed: User not authenticated" },
//       { status: 401 }
//     );
//   }

    const email = req.headers.get("email");
    if (!email) {
        return NextResponse.json(
        { message: "Favourites retrieval failed: User not authenticated" },
        { status: 401 }
        );
    }

    if (!body.timetable) {
        return NextResponse.json({ message: "No timetable data" }, { status: 401 });
    }

  try {
    await User.updateOne(
      { email: email },
      { $push: { favourites: body.timetable } }
    );

    const updatedUser = await User.findOne({ email: email });

    if (updatedUser) {
      const newFavoriteId =
        updatedUser.favourites[updatedUser.favourites.length - 1]._id;
      return NextResponse.json({
        message: "Favourites Save Successful",
        id: newFavoriteId,
      });
    } else {
      return NextResponse.json(
        { message: "Favourites Save failed" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error saving favourites:", error);
    return NextResponse.json(
      { message: "Favourites Save failed due to server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
//   const session: { user: { email: string } } | null = await getServerSession(
//     authOptions
//   );

//   const email = session?.user.email;

//   if (!email) {
//     return NextResponse.json(
//       { message: "Favourites retrieval failed: User not authenticated" },
//       { status: 401 }
//     );
//   }

const email = req.headers.get("email");
if (!email) {
    return NextResponse.json(
      { message: "Favourites retrieval failed: User not authenticated" },
      { status: 401 }
    );
  }

  if (!body.id) {
    return NextResponse.json({ message: "No id to delete data", status: 401 });
  }
  const user = await User.findOneAndUpdate(
    { email: email },
    { $pull: { favourites: { _id: body.id } } },
    { new: true }
  );
  if (user) {
    return NextResponse.json({ message: "Favourites Delete Successful" });
  } else {
    return NextResponse.json({
      message: "Favourites Delete failed",
      status: 404,
    });
  }
}




export async function PUT(req: NextRequest) {
  await dbConnect();

  const { id, newName } = await req.json();
  const email = req.headers.get("email");

  if (!email || !id || !newName) {
    return NextResponse.json({ error: "Missing required data" }, { status: 400 });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email, "favourites._id": new mongoose.Types.ObjectId(id) },
      { $set: { "favourites.$.name": newName } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "Favourite not found or user not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Rename error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}