import { connectMongoDB } from "@/app/lib/mongodb"; 
import User from "@/app/models/user";
import Cours from "@/app/models/course";
import { NextResponse } from "next/server";
import FollowedCourses from "@/app/models/followedCours";

export async function POST(req: Request) {
  try {
    const { userId, courseId } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json({ message: "Missing user ID or course ID" }, { status: 400 });
    }

    await connectMongoDB();

    const user = await User.findOne({ email: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

   
    const course = await Cours.findOne({ title: courseId });
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    const existingFollowedCourse = await FollowedCourses.findOne({
      user: user._id,
      course: course._id,
    });

    if (existingFollowedCourse) {
      return NextResponse.json({ message: "Course already followed" }, { status: 400 });
    }

    const followedCourse = new FollowedCourses({
      user: user._id,
      course: course._id,
    });

    await followedCourse.save();

    return NextResponse.json({ message: "Course followed successfully", followedCourse }, { status: 200 });
  } catch (error) {
    console.error("Error following course:", error);
    return NextResponse.json({ message: "An error occurred while following the course" }, { status: 500 });
  }
}
