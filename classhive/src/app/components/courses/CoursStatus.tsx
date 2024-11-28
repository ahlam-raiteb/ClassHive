"use client";
import React, { useState, useEffect } from "react";
import CoursDetail from "./CoursDetails";
import { useSession } from "next-auth/react";

interface Course {
  _idc: string;
  id: number;
  title: string;
  description: string;
  instructor: string;
  status: string;
  date: string;
}

export default function CoursesStatus() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]); 
  const [fcourses, setFCourses] = useState<Course[]>([]); 
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    const fetchMyCoursesFoll = async () => {
      try {
        const userId = session?.user?.email;
        if (!userId) {
          console.error("User is not logged in");
          return;
        }
  
        const response = await fetch(`/api/getFollowedCourses?userId=${encodeURIComponent(userId)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Followed courses:", data.courses); 
          setFCourses(data.courses || []);

        } else {
          console.error("Failed to fetch followed courses");
        }
      } catch (error) {
        console.error("Error fetching followed courses:", error);
      }
    };
  
    if (session?.user?.email) {
      fetchMyCoursesFoll();
    }
  }, [session]);
  

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


 const getFilteredCourses = () => {
  if (selectedFilter === "followed") {
    return courses.filter((course) =>
      fcourses.some((fCourse) => 
        fCourse.title === course.title && fCourse.date === course.date && fCourse.instructor === course.instructor
        && fCourse.instructor === course.instructor
        )
    );
  }
  if (selectedFilter === "unfollowed") {
    return courses.filter(
      (course) => !fcourses.some((fCourse) => 
        fCourse.title === course.title && fCourse.date === course.date && fCourse.instructor === course.instructor
      && fCourse.instructor === course.instructor) 
    );
  }
  return courses; 
};


  return (
    <section className="flex flex-col items-center w-full h-full p-4">
      <div className="mb-4">
        <button
          onClick={() => setSelectedFilter("all")}
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-md"
        >
          All Courses
        </button>
        <button
          onClick={() => setSelectedFilter("followed")}
          className="px-4 py-2 mx-2 bg-green-500 text-white rounded-md"
        >
          Followed Courses
        </button>
        <button
          onClick={() => setSelectedFilter("unfollowed")}
          className="px-4 py-2 mx-2 bg-red-500 text-white rounded-md"
        >
          Unfollowed Courses
        </button>
      </div>

      <div className="flex flex-wrap gap-4 w-full h-full">
          {getFilteredCourses().map((course) => (
            <div
            key={course.id}
            className="w-[200px] h-[200px] flex flex-col justify-between items-center p-4 border border-gray-300 rounded-lg shadow-lg"
          >
            <CoursDetail
              title={course.title}
              description={course.description}
              instructor={course.instructor}
              status={course.status}
              date={course.date}
            />
          </div>
          
          ))}
        </div>
    </section>
  );
}
