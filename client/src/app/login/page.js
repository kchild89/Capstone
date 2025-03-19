"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRouter } from "@/utils/apiRouter";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const input = { email, password };
      const res = await apiRouter.fetchPost("login", input);

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              404 Academy
            </span>
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
                <Link href="/signup" className="hover:underline">
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 dark:bg-blue-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Login to 404 Academy
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Access your courses and continue learning.
          </p>
        </div>
      </section>

      {/* Login Form - Centered */}
      <main className="container mx-auto px-4 py-10 flex-grow flex justify-center">
        <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Welcome Back
          </h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded text-white font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            >
              LOGIN
            </button>
          </form>

          <div className="text-center mt-6 text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </main>

      {/* Footer - Stays at Bottom */}
      <footer className="bg-white dark:bg-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} 404 Academy All rights reserved.
        </div>
      </footer>
    </div>
  );
}
