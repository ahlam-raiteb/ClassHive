import { connectMongoDB } from "@/app/lib/mongodb";
import FollowedCourses from "@/app/models/followedCours";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { userId, courseId } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json({ message: "Missing user ID or course ID" }, { status: 400 });
    }

    await connectMongoDB();

 
    const followedCourse = await FollowedCourses.findOneAndDelete({
      user: userId,
      course: courseId,
    });

    if (!followedCourse) {
      return NextResponse.json({ message: "Course not found or not followed by user" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course unfollowed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error unfollowing course:", error);
    return NextResponse.json({ message: "An error occurred while unfollowing the course" }, { status: 500 });
  }
}
