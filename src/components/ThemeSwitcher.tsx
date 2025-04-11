// src/components/ThemeSwitcher.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
// อาจจะ import Icons รูป Sun/Moon เพิ่มเติม
// import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme() // resolvedTheme จะบอกค่าจริง (light/dark) แม้ theme จะเป็น 'system'

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // ป้องกัน Hydration Mismatch โดยไม่ render อะไรเลยฝั่ง Server หรือตอน Client โหลดครั้งแรก
    // หรือจะแสดงเป็น Skeleton UI ก็ได้
    return <div className="w-10 h-6 bg-gray-200 rounded-full animate-pulse"></div> // Example placeholder
  }

  // เมื่อโหลดเสร็จแล้ว ให้แสดงปุ่ม
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="p-2 h-10 w-10 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700" // Adjust styling as needed
      onClick={toggleTheme}
    >
      {resolvedTheme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400"> {/* Sun Icon */}
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.106a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75ZM17.836 17.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6.25 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6.25 12ZM7.17 7.17a.75.75 0 0 0-1.06-1.061L4.517 7.697a.75.75 0 0 0 1.06 1.06l1.591-1.59Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700"> {/* Moon Icon */}
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69a.75.75 0 0 1 .981.981A10.503 10.503 0 0 1 12 21a10.5 10.5 0 0 1-10.5-10.5c0-4.306 2.569-8.047 6.304-9.668a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}