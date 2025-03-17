"use client";

import { useEffect, useState } from "react";
import { apiRouter } from "@/utils/apiRouter";
import Link from "next/link";

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
      const userId = 1; // Replace with actual logged-in user ID
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            SchoolName
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 dark:bg-blue-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome to SchoolName
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Empowering students with knowledge and skills for a brighter future.
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <main className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Courses</h2>

        {message && (
          <p className="text-green-600 dark:text-green-400 text-center mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-center mb-4">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.string_id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {course.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Schedule: {course.schedule}
              </p>
              <button
                onClick={() => handleEnroll(course.string_id)}
                className="w-full py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
              >
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-4 mt-10">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} SchoolName. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
