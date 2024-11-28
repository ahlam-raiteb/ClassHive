"use client";
import React, { useState, useEffect } from "react";
import CoursInfo from "./CoursInfo";
import { useSession } from "next-auth/react";


interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  date: string;
  userId: string;
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [addCourseModal, setAddCourseModal] = useState(false);

  const { data: session } = useSession();
  const [newCourse, setNewCourse] = useState<Course>({
    id: Date.now(),
    title: "",
    description: "",
    instructor: "",
    date: "",
    userId:"",
   });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"title" | "instructor">("title");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  
  
 
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const userId = session?.user?.email;
        if (!userId) {
          console.error("User is not logged in");
          return;
        }
  
        const response = await fetch(`/api/mycourses?userId=${encodeURIComponent(userId)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
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
  
    if (session?.user?.email) {
      fetchMyCourses();
    }
  }, [session]);

  useEffect(() => {
    const filterCourses = () => {
      const trimmedSearchTerm = searchTerm.trim().toLowerCase();

      if (trimmedSearchTerm === "") {
        setFilteredCourses([]);
        return;
      }

      const filtered = courses.filter((course) => {
        if (searchType === "title") {
          return course.title.toLowerCase().includes(trimmedSearchTerm);
        } else if (searchType === "instructor") {
          return course.instructor.toLowerCase().includes(trimmedSearchTerm);
        }
        return false;
      });

      setFilteredCourses(filtered);
    };

    filterCourses();
  }, [searchTerm, searchType, courses]);

  const handleAddCourse = async () => {
    const userId = session?.user?.email;
    if (!userId) {
      console.error("User is not logged in");
      return;
    }
    newCourse.instructor = userId;
    const infoCourse = { ...newCourse, userId };
  
    if (
      !infoCourse.title ||
      !infoCourse.description ||
      !infoCourse.instructor ||
      !infoCourse.date ||
      !infoCourse.userId
    ) {
      console.log("Please fill all fields, including user information");
      return;
    }
  
    console.log("Submitting course:", infoCourse);
  
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(infoCourse),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCourses((prev) => [...prev, data.course]);
        setAddCourseModal(false);
        setNewCourse({
          id: Date.now(),
          title: "",
          description: "",
          instructor: "",
          date: "",
          userId: "",
        });
      } else {
        console.error("Failed to create course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };
  

  const toggleSearchVisibility = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <section className="flex flex-col w-full h-full border border-gray-300 rounded-lg shadow-lg">
      <div className="flex justify-between items-center bg-Main text-black p-4 rounded-t-lg shadow">
        <div className="flex space-x-4 items-center w-[60%]">
          <button onClick={toggleSearchVisibility}>
            <p> / </p>
          </button>

          {isSearchVisible && (
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as "title" | "instructor")}
              className="border rounded p-2 text-black"
            >
              <option value="title">Search by Title</option>
              <option value="instructor">Search by Instructor</option>
            </select>
          )}

          <input
            type="text"
            className="p-2 w-[300px] h-[40px] border rounded focus:outline-none"
            placeholder={`Search courses by ${searchType}...`}
            aria-label="Search courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="flex items-center p-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => setAddCourseModal(true)}
        >
          <span className="ml-2">Add Course</span>
        </button>
      </div>

      <div className="flex flex-col w-full h-full overflow-y-auto p-4">
        {!searchTerm ? (
          <>
            {courses.length > 0 ? (
              courses.map((course) => (
                <CoursInfo
                  key={`${course.id}-${course.title}`}
                  title={course.title}
                  description={course.description}
                  instructor={course.instructor}
                  date={course.date}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No courses available.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CoursInfo
                  key={`${course.id}-${course.title}`}
                  title={course.title}
                  description={course.description}
                  instructor={course.instructor}
                  date={course.date}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No matching courses found.</p>
              </div> 
            )}
          </>
        )}
      </div>

      {addCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-semibold text-center text-gray-800">Add New Course</h2>
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.title}
              onChange={(e) => setNewCourse((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 my-2 border rounded focus:outline-none"
            />
            <input
              type="text"
              placeholder="Course Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 my-2 border rounded focus:outline-none"
            />
            <input
              type="date"
              value={newCourse.date}
              onChange={(e) => setNewCourse((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 my-2 border rounded focus:outline-none"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddCourse}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Save Course
              </button>
              <button
                onClick={() => setAddCourseModal(false)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
