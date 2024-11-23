import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { firstname, lastname, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        await connectMongoDB();
        await User.create({firstname, lastname, email, password: hashedPassword});

        return NextResponse.json({ message: "User registered" }, { status: 200 });
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json(
            { message: "Error occurred while registering the user" },
            { status: 500 }
        );
    }
}
