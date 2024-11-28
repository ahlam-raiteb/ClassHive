"use client";

import React, { useState } from "react";
import { Checkbox } from "pretty-checkbox-react";
import { DeleteIcon, EditIcon } from "@/app/icone/icone";
import { useSession } from "next-auth/react";

interface CoursInfoProps {
  title: string;
  description: string;
  instructor: string;
  date: string;
}

export default function CoursInfo({ title, description, instructor, date }: CoursInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedInstructor, setEditedInstructor] = useState(instructor);
  const [editedDate, setEditedDate] = useState(date);
  const { data: session } = useSession();


  const deleteCours = async () => {
    const userId = session?.user?.email;
    if (!userId) {
      console.error("User is not logged in");
      return;
    }
    try {
      const response = await fetch("/api/deletecours", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, userId }),
      });
      if (response.ok) {
        console.log("Course deleted");
      } else {
        console.log("Failed to delete course");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };


  const updateCours = async () => {
    const userId = session?.user?.email;
    if (!userId) {
      console.error("User is not logged in");
      return;
    }
  
    try {
      const response = await fetch("/api/updatecours", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
          instructor: editedInstructor,
          date: editedDate,
          userId: userId,
        }),
      });
  
      if (response.ok) {
        console.log("Course updated");
        setIsEditing(false);
      } else {
        console.log("Failed to update course");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="flex w-full h-[60px] items-center justify-between border-b p-4 shadow space-x-8">
      <Checkbox className="mr-3" />

      <p className="w-1/4 truncate" >{title}</p>

      <p className="w-1/4 truncate" >{description}</p>

      <p className="w-1/4">{instructor}</p>
      <p className="w-1/4">{date}</p>

      <button onClick={() => setIsEditing(true)}>
        <EditIcon />
      </button>
      <button onClick={deleteCours}>
        <DeleteIcon />
      </button>

      {isEditing && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateCours(); 
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Instructor</label>
                <input
                  type="text"
                  value={editedInstructor}
                  onChange={(e) => setEditedInstructor(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="text"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mr-4 px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
