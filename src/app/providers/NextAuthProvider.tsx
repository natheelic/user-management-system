// src/app/providers/NextAuthProvider.tsx
'use client'; // Provider component มักจะต้องเป็น Client Component

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// กำหนด Type ของ Props ให้รับ children
interface NextAuthProviderProps {
  children: React.ReactNode;
  // คุณอาจจะส่ง session prop มาด้วย ถ้ามีการ fetch session ล่วงหน้าฝั่ง Server
  // session?: any;
}

// สร้าง Component ที่จะทำหน้าที่เป็น Provider
export default function NextAuthProvider({ children }: NextAuthProviderProps) {
  // Render SessionProvider ที่ import มา โดยครอบ children ที่รับเข้ามา
  // เพื่อให้ข้อมูล Session พร้อมใช้งานผ่าน useSession() Hook ได้ทั่วทั้ง App
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}