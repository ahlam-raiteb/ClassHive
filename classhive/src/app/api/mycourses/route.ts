import { connectMongoDB } from "@/app/lib/mongodb";
import Cours from "@/app/models/course";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
}

export async function GET(req: NextRequest) {
  try {

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

  
    await connectMongoDB();


    const userCourses: Course[] = await Cours.find({ user: userId }).exec();

    return NextResponse.json({ courses: userCourses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return NextResponse.json({ message: "Error occurred while fetching courses" }, { status: 500 });
  }
}
