import { connectMongoDB } from "@/app/lib/mongodb";
import Cours from "@/app/models/course";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectMongoDB();
        const courses = await Cours.find();
    
        return NextResponse.json({ courses }, { status: 200 });
      } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json(
          { message: "Error occurred while fetching courses" },
          { status: 500 }
        );
      }
}
