"use client";

import Link from "next/link";

export default function Home() {
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
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {/* Hero Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-500">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome to 404 Academy
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Empowering your future with modern courses and expert guidance.
          </p>
          <div className="mt-8 space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Login
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              View Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Expert Instructors</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Learn from industry leaders and experienced professionals.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Modern Curriculum</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Stay ahead with up-to-date courses and hands-on projects.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Flexible Learning</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Access courses anytime, anywhere, on any device.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()}404 Academy All rights reserved.
        </div>
      </footer>
    </div>
  );
}
