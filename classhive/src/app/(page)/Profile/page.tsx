"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IconDocu, IconFlesh } from "../../icone/icone";
import CoursesList from "../../components/courses/CoursList";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";


interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  date: string;
}

export default function Profile() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/allcourses");
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
  return (
    <div className="flex flex-col w-full h-full p-6 space-y-6 rounded-lg">
      <section className="flex items-center justify-between bg-white shadow rounded-md p-4">
        <div className="flex items-center space-x-4">
          <Image
            src="/images/avatar.png"
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-full border border-gray-200"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">{session?.user?.name || "Username"}</p>
            <p className="text-sm text-gray-500">{session?.user?.email || "Email Address"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold text-indigo-600">{courses.length}</p>
            <p className="text-sm text-gray-500">Courses</p>
          </div>
          <IconDocu />
        </div>
      </section>

      <section className="flex items-center h-[74%] justify-center p-3">
        <CoursesList />
      </section>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex flex-col justify-end self-end text-[16px] text-TextColor mt-10 p-3"
      >
        Logout
        <IconFlesh />
      </button>
    </div>
  );
}
