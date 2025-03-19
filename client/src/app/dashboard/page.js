"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRouter } from "@/utils/apiRouter";
import { useRouter } from "next/navigation";
import validateToken from "@/utils/validateToken";

export default function DashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function auth() {
      const valid = await validateToken();
      if (!valid) {
        router.push("/login");
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    }
    auth();
  }, [router]);

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

  // **Logout function**
  const handleLogout = async () => {
    try {
      const res = await apiRouter.fetchPost("logout"); // Call the logout API
      if (res.ok) {
        router.push("/login"); // Redirect to login after logout
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (loading) {
    return <div>loading...</div>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            404 Academy
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:underline">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:underline text-red-500"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 dark:bg-blue-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome, {userData ? userData.name : "User"}
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Here&apos;s an overview of your learning progress.
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-10">
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Enrolled Courses Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Enrolled Courses</h2>
            {courses.length > 0 ? (
              <ul className="list-disc pl-5">
                {courses.slice(0, 5).map((course) => (
                  <li key={course.string_id} className="mb-1">
                    {course.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No courses enrolled yet.</p>
            )}
            <Link
              href="/courses"
              className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All Courses
            </Link>
          </div>

          {/* Progress Stats Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Total Courses: {courses.length}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Upcoming Course: {courses.length > 0 ? courses[0].title : "N/A"}
            </p>
            <Link
              href="/profile"
              className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Profile
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-4 mt-10">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} 404 Academy All rights reserved.
        </div>
      </footer>
    </div>
  );
}
