// src/app/profile/page.tsx
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // Import authOptions ของคุณ
import { redirect } from 'next/navigation'

// Page นี้เป็น Server Component โดย default (ไม่ต้องใส่ 'use client')
export default async function ProfilePage() {
  // ดึงข้อมูล Session ฝั่ง Server
  const session = await getServerSession(authOptions);

  // ---- การป้องกันอีกชั้น (เผื่อ Middleware ไม่ทำงาน หรือเข้าถึงโดยตรง) ----
  if (!session || !session.user) {
     // ถ้าไม่มี session ให้ redirect ไปหน้า login
     redirect('/login');
     // return null; // หรือ return null ถ้า redirect ไม่ทำงานทันที (แต่ปกติ redirect จะทำงาน)
  }
  // --------------------------------------------------------------------

  // ถ้ามี session แสดงข้อมูลผู้ใช้
  return (
    <div className="container mx-auto px-4 py-8"> {/* ใช้ Tailwind จัด Layout */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Your Profile</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</p>
          <p className="text-lg text-gray-900 dark:text-gray-50">
            {session.user.name ?? 'N/A'} {/* แสดงชื่อ ถ้ามี */}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</p>
          <p className="text-lg text-gray-900 dark:text-gray-50">
            {session.user.email ?? 'N/A'} {/* แสดง Email */}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID:</p>
          <p className="text-lg text-gray-900 dark:text-gray-50">
             {/* session.user.id ถูกเพิ่มเข้ามาผ่าน callback ใน authOptions */}
            {session.user.id ?? 'N/A'}
          </p>
        </div>
         {/* แสดงข้อมูลอื่นๆ จาก session.user ได้ตามต้องการ */}
         {/* เช่น รูปภาพ: <img src={session.user.image ?? ''} alt="Profile" /> */}
      </div>
    </div>
  );
}