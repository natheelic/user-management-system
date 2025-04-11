// src/app/verify-email/page.tsx
'use client'; // ระบุว่าเป็น Client Component เพื่อใช้ Hooks

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import Link from 'next/link'; // Import Link for login button

// สร้าง Component ย่อยเพื่อใช้ Suspense (จำเป็นสำหรับ useSearchParams)
function VerificationStatus() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState<string>('Verifying your email...');

    useEffect(() => {
        // ทำงานเมื่อ Component โหลด หรือ token เปลี่ยน
        if (!token) {
            setStatus('error');
            setMessage('Verification token not found in URL.');
            return; // หยุดการทำงานถ้าไม่มี token
        }

        const verifyToken = async () => {
            setStatus('loading');
            setMessage('Verifying your email...');
            try {
                const response = await fetch(`/api/verify-email?token=${token}`, {
                    method: 'GET', // GET request as defined in our API route
                });

                const data = await response.json();

                if (!response.ok) {
                    // ถ้า API response status ไม่ใช่ 2xx
                    throw new Error(data.message || `Verification failed (Status: ${response.status})`);
                }

                // สำเร็จ
                setStatus('success');
                setMessage(data.message || 'Email verified successfully!');

            } catch (error: unknown) {
                console.error('Verification fetch error:', error);
                setStatus('error');
                if (error instanceof Error) {
                    setMessage(error.message || 'An error occurred during verification.');
                } else {
                    setMessage('An unknown error occurred during verification.');
                }
            }
        };

        verifyToken();

    }, [token]); // dependency array ให้ useEffect ทำงานเมื่อ token เปลี่ยน

    // Render UI based on status
    return (
        <div className="text-center">
            {status === 'loading' && (
                <p className="text-lg text-gray-600">{message}</p>
                // อาจจะใส่ Spinner/Loading indicator ที่นี่
            )}
            {status === 'success' && (
                <div>
                    <p className="text-lg text-green-600 font-semibold mb-4">{message}</p>
                    <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Go to Login
                    </Link>
                </div>
            )}
            {status === 'error' && (
                 <div>
                    <p className="text-lg text-red-500 font-semibold mb-4">{message}</p>
                    {/* อาจจะมีปุ่มให้ลองใหม่ หรือติดต่อ Support */}
                 </div>
            )}
        </div>
    );
}


// Page Component หลัก
export default function VerifyEmailPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Email Verification</h1>
        {/* ใช้ Suspense ครอบ Component ที่ใช้ useSearchParams */}
        <Suspense fallback={<p className="text-center text-lg text-gray-600">Loading...</p>}>
            <VerificationStatus />
        </Suspense>
      </div>
    </div>
  );
}