
import React from "react"
import CoursStatus from "../../components/courses/CoursStatus";



export default function Courses() {
    return (
        <div className="flex flex-col w-full h-full ">
  
            <section className="flex w-[98%] h-[95%]  items-center justify-center p-3">
                <CoursStatus />
            </section>
        </div>
    )
}