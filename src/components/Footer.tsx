// src/components/Footer.tsx
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear(); // ดึงปีปัจจุบัน

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto py-6"> {/* mt-auto ช่วยดัน Footer ลงล่างถ้า Content ไม่เต็มจอ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; {currentYear} Your Company Name or App Name. All rights reserved.
          {/* คุณสามารถเพิ่ม Link หรือข้อความอื่นๆ ได้ตามต้องการ */}
        </p>
      </div>
    </footer>
  );
}