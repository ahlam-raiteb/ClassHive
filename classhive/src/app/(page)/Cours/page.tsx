"use client"
import React from "react"
import CoursStatus from "../../components/courses/CoursStatus";
import { signOut } from "next-auth/react";
import { IconFlesh } from "@/app/icone/icone";



export default function Courses() {
    return (
        <div className="flex flex-col w-full h-full ">
  
            <section className="flex w-[98%] h-[95%]  items-center justify-center p-3">
                <CoursStatus />
            </section>
            <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex flex-col justify-end self-end text-[16px] text-TextColor mt-10 p-7"
            >
                Logout
                <IconFlesh />
            </button>
        </div>
    )
}