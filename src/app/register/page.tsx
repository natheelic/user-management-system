// src/app/register/page.tsx
'use client'; // ระบุว่าเป็น Client Component

import React, { useState, FormEvent } from 'react';
// import { toast } from 'react-hot-toast'; // เราจะใช้ทีหลัง

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Reset error
    setSuccessMessage(null); // Reset success message

    // Basic client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!email || !password) {
        setError('Please fill in all fields');
        return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from API (e.g., user exists, validation failed)
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Registration successful
      setSuccessMessage(data.message || 'Registration successful! Please check your email.');
      // toast.success(data.message || 'Registration successful! Please check your email.'); // ใช้ toast ทีหลัง
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // อาจจะ redirect ไปหน้า login หรือหน้าแจ้งเตือน

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Registration failed:', error);
        setError(error.message || 'Registration failed. Please try again.');
      } else {
        console.error('An unexpected error occurred:', error);
        setError('An unexpected error occurred. Please try again.');
      }
      // toast.error(error.message || 'Registration failed. Please try again.'); // ใช้ toast ทีหลัง
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="mb-4 text-red-500 text-sm text-center">{error}</p>}
          {successMessage && <p className="mb-4 text-green-500 text-sm text-center">{successMessage}</p>}
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {/* Add link to login page later */}
        {/* <p className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p> */}
      </div>
    </div>
  );
}