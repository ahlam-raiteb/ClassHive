import { connectMongoDB } from "@/app/lib/mongodb";
import Cours from "@/app/models/course";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { userId, title} = await req.json();

        if (!userId) {
          return NextResponse.json({ message: "Missing userId" }, { status: 400 });
        }
        if (!title) {
            return NextResponse.json(
                { message: "Course title is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        const user = await User.findOne({ email: userId }).exec();
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const deletedCourse = await Cours.findOneAndDelete({ title , user: user._id });


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
