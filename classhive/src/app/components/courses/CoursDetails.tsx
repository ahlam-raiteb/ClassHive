"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface CoursInfoProps {
  title: string;
  description: string;
  instructor: string;
  status: string;
  date: string;
  isFollowing: boolean; 
}

export default function CoursDetails({ title, description, instructor, status, date, isFollowing: initialFollowingStatus,
}: CoursInfoProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(initialFollowingStatus);
  const { data: session } = useSession();
  const statusBorderColor = status === "FINISHED" ? "bg-red-500" : "bg-green-500";

  useEffect(() => {
 
    setIsFollowing(initialFollowingStatus);
  }, [initialFollowingStatus]);

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

      if (response.ok) {
        setIsFollowing(true);
        console.log("Course followed successfully");
      } else {
        console.error("Failed to follow course");
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

      if (response.ok) {
        setIsFollowing(false);
        console.log("Course unfollowed successfully");
      } else {
        console.error("Failed to unfollow course");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <button
        onClick={isFollowing ? unfollowCourse : followCourse}
        className={`flex border w-[80px] h-[30px] self-end items-center rounded shadow justify-center ${
          isFollowing ? "bg-gray-500" : "bg-blue-500"
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
