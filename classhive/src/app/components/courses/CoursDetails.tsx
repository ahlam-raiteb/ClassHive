import React from "react";

interface CoursInfoProps {
  title: string;
  description: string;
  status: string;
  date: string;
}

export default function CoursDetail({ title, description, status, date }: CoursInfoProps) {
  const statusBorderColor = status === "FINISHED" ? "bg-red-500" : "bg-green-500";

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <h3 className="font-bold mb-2 w-1/2 truncate" >{title}</h3>
      <p className=" mb-2 w-1/2 truncate">{description}</p>
      <p className={`w-fit rounded px-2 py-1 ${statusBorderColor} mb-2 self-center`}>{status}</p>
      <p className="text-center">{date}</p>
    </div>
  );
}
