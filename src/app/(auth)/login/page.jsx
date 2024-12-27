"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the 'redirect' query parameter from the URL, default to '/' if not provided
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear any previous errors
    setLoading(true); // Start loading state

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      // Attempt sign in with credentials
      const resp = await signIn("credentials", {
        email,
        password,
        redirect: false, // Disable automatic redirection from NextAuth
      });

      setLoading(false); // Reset loading state

      if (resp?.error) {
        // Display error if login fails
        setError(resp.error);
      } else if (resp?.ok) {
        // Show success message and redirect after 2 seconds
        toast.success("Successfully Logged In");
        
          // Navigate to the redirect URL or default to '/'
          router.push('/');
      
      }
    } catch (error) {
      setLoading(false); // Reset loading state in case of error
      setError("An error occurred during login."); // Fallback error message
    }
  };

  return (
    <div className="px-4 py-6 md:w-[40%] md:mx-auto mx-2 bg-gray-50 shadow-md rounded-md mt-10 mb-20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="border rounded-md p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border rounded-md p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-md focus:ring-2 focus:ring-yellow-300 focus:outline-none transition"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in ..." : "Login"}
          </button>
        </div>

        <div className="text-center text-sm">
          New Here? Please{" "}
          <Link href="/signup" className="text-blue-600 font-semibold">
            Signup here
          </Link>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default Login;
