"use client";
import React, { useState, useEffect } from "react";
import CoursDetail from "./CoursDetails";

interface Course {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
}

export default function CoursesStatus() {
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
    <section className="flex flex-wrap gap-4 w-full h-full p-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="w-[200px] h-[200px] flex flex-col justify-between items-center p-4 border border-gray-300 rounded-lg shadow-lg"
        >
          <CoursDetail
            title={course.title}
            description={course.description}
            status={course.status}
            date={course.date}
          />
        </div>
      ))}
    </section>
  );
}
