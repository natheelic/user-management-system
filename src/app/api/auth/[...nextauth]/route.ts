// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google'; // ถ้าคุณตั้งค่า Google ไว้ ก็ uncomment
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

// กำหนด Options ทั้งหมดสำหรับการ Authentication
export const authOptions: NextAuthOptions = {
  // ใช้ Prisma Adapter เพื่อเชื่อมต่อกับ Database ของคุณ
  adapter: PrismaAdapter(prisma),

  // กำหนด Providers สำหรับวิธีการ Login ต่างๆ
  providers: [
    /* // ตัวอย่าง Google Provider (ถ้าใช้)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    */

    // Credentials Provider สำหรับ Email/Password Login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize attempt:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("Authorize failed: Missing credentials");
          throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          // include: { roles: { select: { name: true } } } // ถ้าต้องการ Role ใน Session
        });

        if (!user) {
          console.log(`Authorize failed: User not found for email ${credentials.email}`);
          throw new Error('ไม่พบผู้ใช้งานด้วยอีเมลนี้');
        }

        if (!user.passwordHash) {
          console.log(`Authorize failed: User ${credentials.email} has no password hash`);
          throw new Error('บัญชีนี้อาจลงทะเบียนด้วยวิธีอื่น');
        }

        if (!user.emailVerified) {
          console.log(`Authorize failed: User ${credentials.email} email not verified`);
          throw new Error('กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ');
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          console.log(`Authorize failed: Invalid password for user ${credentials.email}`);
          throw new Error('รหัสผ่านไม่ถูกต้อง');
        }

        console.log(`Authorize successful for user ${credentials.email}`);
        return { // คืนค่า User Object (ห้ามมี passwordHash)
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          // roles: user.roles // ถ้า include มา
        };
      } // End authorize
    }), // End CredentialsProvider
  ], // End providers

  // กำหนด Session Strategy
  session: {
    strategy: 'jwt', // หรือ 'database'
  },

  // Callbacks สำหรับปรับแต่ง JWT และ Session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // if (user.roles) token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      // if (token?.roles && session.user) {
      //   session.user.roles = token.roles as any;
      // }
      return session;
    }
  },

  // ระบุหน้า Custom Login
  pages: {
    signIn: '/login',
    // error: '/auth/error', // Optional
  },

  // ค่า Secret
  secret: process.env.NEXTAUTH_SECRET,

  // เปิด Debug Mode ตอน Development
  debug: process.env.NODE_ENV === 'development',
};

// สร้างและ Export ตัว Handler หลักของ NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };