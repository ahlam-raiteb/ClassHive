import { connectMongoDB } from "@/app/lib/mongodb";
import Cours from "@/app/models/course";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { userId, title, description, instructor, date } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    if (!title || !description || !instructor || !date) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

   
    await connectMongoDB();


    const user = await User.findOne({ email: userId }).exec();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedCourse = await Cours.findOneAndUpdate(
      { user: user._id },
      { title, description, instructor, date },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course updated successfully", course: updatedCourse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { message: "Error occurred while updating the course" },
      { status: 500 }
    );
  }
}
