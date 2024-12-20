import { connectMongoDB } from "@/app/lib/mongodb";
import Cours from "@/app/models/course";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("userId");

    if (!email) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    await connectMongoDB();


    const user = await User.findOne({ email }).exec();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }


    const userCourses = await Cours.find({ user: user._id }).exec();

    return NextResponse.json({ courses: userCourses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return NextResponse.json({ message: "Error occurred while fetching courses" }, { status: 500 });
  }
}
