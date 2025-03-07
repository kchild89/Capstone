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
        // Redirect on successful login
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-md p-8">
        <h1 className="text-2xl text-black font-bold text-center mb-4">
          Welcome
        </h1>

        {/* Placeholder icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 h-16 w-16 flex items-center justify-center rounded-full">
            <span className="text-2xl font-bold">A</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer"></div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded text-white font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          >
            LOGIN
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
