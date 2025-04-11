// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold">
              Your App
            </Link>
            {/* Add other nav links here if needed */}
            {/* <Link href="/dashboard" className="ml-4 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Dashboard</Link> */}
          </div>
          <div className="flex items-center">
            {status === 'loading' && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}

            {status === 'unauthenticated' && (
              <>
                <button
                  onClick={() => signIn()} // อาจจะให้ไปหน้า /login โดยตรงก็ได้ Link href="/login"
                  className="ml-4 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </button>
                 <Link href="/register" className="ml-2 px-3 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50">
                   Register
                 </Link>
              </>
            )}

            {status === 'authenticated' && (
              <div className="flex items-center space-x-3">
                 <span className="text-sm text-gray-700">
                   Hi, {session.user?.name || session.user?.email}!
                 </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })} // Redirect to login page after logout
                  className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}