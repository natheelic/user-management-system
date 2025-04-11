// src/app/providers/ThemeProvider.tsx
'use client' // จำเป็นต้องเป็น Client Component

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // ใช้ ThemeProvider จาก next-themes ครอบ children
  // attribute="class" -> ใช้ class strategy (เพิ่ม class 'dark' ที่ html tag)
  // defaultTheme="system" -> ค่าเริ่มต้นให้ใช้ตามการตั้งค่าของ OS/Browser
  // enableSystem -> เปิดใช้งานการตรวจจับ system theme
  return <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>{children}</NextThemesProvider>
}