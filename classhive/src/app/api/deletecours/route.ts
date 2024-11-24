import { connectMongoDB } from "@/app/lib/mongodb";
import Cours from "@/app/models/course";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { title } = await req.json();
        if (!title) {
            return NextResponse.json(
                { message: "Course title is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        const deletedCourse = await Cours.findOneAndDelete({ title });

        if (!deletedCourse) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Course deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json(
            { message: "Error occurred while deleting the course" },
            { status: 500 }
        );
    }
}
