// middleware.ts (หรือ src/middleware.ts)

// วิธีที่ 1: ใช้ Default ของ withAuth (ง่ายที่สุด)
// export { default } from "next-auth/middleware"
// วิธีนี้จะป้องกันทุกหน้า ยกเว้นหน้าที่ NextAuth ยกเว้นให้ (เช่น /api/auth/*)
// และจะ Redirect ไปหน้าที่ระบุใน pages.signIn ของ authOptions

// --- หรือ ---

// วิธีที่ 2: ใช้ withAuth พร้อม Configuration เพิ่มเติม (ยืดหยุ่นกว่า)
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` จะเสริม object `token` เข้าไปใน `req` ถ้า user login แล้ว
  function middleware(req) {
    // console.log("Middleware token:", req.nextauth.token); // ดูข้อมูลใน Token ได้

    // --- ตัวอย่าง: การป้องกันตาม Role (ถ้าต้องการทำในอนาคต) ---
    // if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
    //   return new NextResponse("You are not authorized!");
    // }
    // if (req.nextUrl.pathname.startsWith("/member") && req.nextauth.token?.role !== "member") {
    //   return new NextResponse("You must be a member!");
    // }
    // -------------------------------------------------------------

    // ถ้าผ่านเงื่อนไขทั้งหมด ก็ให้ไปต่อตามปกติ
    return NextResponse.next();
  },
  {
    callbacks: {
      // Callback นี้จะทำงานก่อน middleware หลัก
      // คืนค่า true ถ้า user ได้รับอนุญาต หรือ false ถ้าไม่ (จะถูก redirect ไปหน้า signIn)
      authorized: ({ req, token }) => {
        // console.log("Authorized callback token:", token);
        // ถ้า token มีค่า (แสดงว่า login แล้ว) ก็ถือว่า authorized สำหรับ Route ที่ถูก Match
        // ถ้า return !!token; จะหมายความว่า แค่ login ก็เข้าได้หมดทุกหน้าที่ Matcher ระบุ
        return !!token;
      }
    },
    // สามารถ Override หน้า Login ได้ที่นี่ แต่ปกติจะอ่านจาก authOptions
    // pages: {
    //   signIn: "/login",
    // }
  }
);

// --- ส่วนสำคัญ: กำหนดว่า Middleware นี้จะทำงานกับ Path ไหนบ้าง ---
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (Login page)
     * - /register (Register page)
     * - /verify-email (Email verification page)
     * - / (Homepage - ถ้าต้องการให้เข้าได้โดยไม่ต้อง Login)
     */
    // ตัวอย่าง: ป้องกันหน้า Dashboard และ Profile
     '/dashboard/:path*',
     '/profile/:path*',
     '/settings/:path*', // ถ้ามีหน้า Settings
    // เพิ่ม Path อื่นๆ ที่ต้องการป้องกันที่นี่
    // '/admin/:path*', // ถ้าต้องการป้องกันส่วน Admin ทั้งหมด

    /*
     * หรือจะใช้ Regular Expression ที่ซับซ้อนกว่านี้ก็ได้
     * ดูตัวอย่างได้ที่: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
     *
     * ถ้าใช้แบบข้างบนนี้ จะต้อง List Path ที่ต้องการป้องกันทั้งหมด
     * แต่ถ้าต้องการป้องกัน "ทุกหน้า" ยกเว้นบางหน้า อาจจะใช้ Negative Lookahead ใน Regex
     * หรือใช้ วิธีที่ 1 (export { default } ...) จะง่ายกว่า
     */
  ]
};