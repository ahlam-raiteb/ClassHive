import { connectMongoDB } from "@/app/lib/mongodb";
import Cours from "@/app/models/course";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const { title, description, instructor, date } = await req.json();

        if (!title || !description || !instructor || !date) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const updatedCourse = await Cours.findOneAndUpdate(
            { date }, 
            { title ,description, instructor },
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
