import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import FollowedCourses from "@/app/models/followedCours";

export async function GET(req: Request) {
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

    const followedCourses = await FollowedCourses.find({ user: user._id })
      .populate("course")
      .exec();

   
    const userCourses = followedCourses.map((followedCourse) => followedCourse.course);

    return NextResponse.json({ courses: userCourses }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user's courses:", error);
    return NextResponse.json({ message: "Error fetching courses" }, { status: 500 });
  }
}
