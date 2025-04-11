// src/app/login/page.tsx
'use client'; // ระบุว่าเป็น Client Component

import React, { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react'; // Import signIn
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import Link from 'next/link'; // Import Link

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Reset error on new submission
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false, // <<< สำคัญ: ป้องกัน redirect อัตโนมัติ
        email: email,
        password: password,
      });

      if (result?.error) {
        // If signIn returns an error (e.g., wrong password, user not found, not verified from authorize function)
        setError(result.error);
        setIsLoading(false); // Stop loading indicator
      } else if (result?.ok) {
        // If signIn is successful (result.ok is true and no error)
        // Redirect to dashboard or desired page
        router.push('/dashboard'); // <<< เปลี่ยน '/dashboard' เป็น path ที่ต้องการหลัง login สำเร็จ
        // ไม่ต้อง setIsLoading(false) เพราะจะ redirect ไปหน้าอื่นแล้ว
      } else {
         // Handle unexpected cases where result is null or not ok without error
         setError('An unexpected error occurred during login.');
         setIsLoading(false);
      }
    } catch (err) {
       // Handle errors during the fetch/network request itself (less common)
       console.error("Login fetch error:", err);
       setError('Failed to connect to the server. Please try again.');
       setIsLoading(false);
    }
    // setIsLoading(false); // Moved inside error/unexpected case handling
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="mb-4 text-red-500 text-sm text-center">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
          </div>
          {/* Optional: Add remember me or forgot password links later */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
         {/* <p className="mt-2 text-center text-sm">
          <Link href="/forgot-password" className="text-indigo-600 hover:underline">
            Forgot Password?
          </Link>
        </p> */}
      </div>
    </div>
  );
}