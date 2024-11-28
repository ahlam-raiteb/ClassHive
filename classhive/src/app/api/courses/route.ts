import { connectMongoDB } from "@/app/lib/mongodb";
import Cours from "@/app/models/course";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description, instructor, date, userId } = await req.json();

    if (!title || !description || !instructor || !date || !userId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    console.log("user name : ",userId);

    await connectMongoDB();

    const user = await User.findOne({ email: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newCourse = await Cours.create({
      title,
      description,
      instructor,
      date,
      user: user._id,
    });

    return NextResponse.json({ message: "Course created", course: newCourse }, { status: 200 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ message: "Error occurred while creating the course" }, { status: 500 });
  }
}
