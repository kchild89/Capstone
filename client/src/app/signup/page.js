"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRouter } from "@/utils/apiRouter";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = email.split("@")[0];

    try {
      const input = {
        username,
        email,
        password,
        firstName,
        lastName,
        phone,
        address,
      };
      const res = await apiRouter.fetchPost("signup", input);

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Sign Up Failed");
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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

      {/* Signup Form */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <textarea
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="2"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded text-white font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:ring-2 focus:ring-blue-300 transition-colors"
            >
              SIGN UP
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} 404 Academy All rights reserved.
        </div>
      </footer>
    </div>
  );
}
