"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface CoursInfoProps {
  title: string;
  description: string;
  instructor: string;
  status: string;
  date: string;
}

export default function CoursDetails({ title, description, instructor, status, date }: CoursInfoProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [checkFollowing, setCheckFollowing] = useState(false);
  const { data: session } = useSession();
  const statusBorderColor = status === "FINISHED" ? "bg-red-500" : "bg-green-500";

 

  const followCourse = async () => {
    const userId = session?.user?.email;
    const courseId = title;

    try {
      const response = await fetch("/api/followcours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(true);
        console.log("Course followed successfully:", data);
      } else {
        setCheckFollowing(true)
        console.error("Failed to follow course:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const unfollowCourse = async () => {
    const userId = session?.user?.email;
    const courseId = title;

    try {
      const response = await fetch("/api/unfollowcours", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(false);
        console.log("Course unfollowed successfully:", data);
      } else {
        setCheckFollowing(false)
        console.error("Failed to unfollow course:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
        <button
          onClick={isFollowing ? unfollowCourse : followCourse}
          className={`flex border w-[60px] h-[30px] self-end items-center rounded shadow justify-center ${
            isFollowing  ? "bg-gray-500" : "bg-blue-500"
          }`}
        disabled={false}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
      <h3 className="font-bold mb-2 w-1/2 truncate">{title}</h3>
      <p className="mb-2 w-1/2 truncate">{description}</p>
      <p className="mb-2 w-1/2 truncate">{instructor}</p>
      <p className={`w-fit rounded px-2 py-1 ${statusBorderColor} mb-2 self-center`}>{status}</p>
      <p className="text-center">{date}</p>
    </div>
  );
}
