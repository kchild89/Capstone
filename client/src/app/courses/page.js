"use client";

import { useEffect, useState } from "react";
import { apiRouter } from "@/utils/apiRouter";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRouter.fetchGet("courses");
        if (!res.ok) throw new Error("Failed to load courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError("Error fetching courses");
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    setMessage(""); // Clear previous messages
    setError("");

    try {
      const userId = 1; // 🔥 Replace with actual logged-in user ID
      const res = await apiRouter.fetchPost("enroll", { userId, courseId });

      if (!res.ok) {
        throw new Error("Enrollment failed");
      }

      setMessage("Successfully enrolled!");
    } catch (err) {
      setError("Failed to enroll in course");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {courses.map((course) => (
          <div key={course.string_id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-gray-500">Schedule: {course.schedule}</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => handleEnroll(course.string_id)}
            >
              Enroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
