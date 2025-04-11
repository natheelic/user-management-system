// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import instance ที่สร้างไว้
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Basic Validation
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // --- เพิ่ม Validation อื่นๆ ได้ตามต้องการ ---
    // เช่น ตรวจสอบรูปแบบ Email, ความยาว Password

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
    }

    // 3. Hash the password
    const saltRounds = 10; // Recommended value
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        // emailVerified จะเป็น null โดย default ตาม schema
      },
    });

    // --- TODO: Implement Email Verification ---
    // 5. Generate verification token
    // 6. Store token in VerificationToken table
    // 7. Send verification email (using Resend, Nodemailer, etc.)
    // ------------------------------------------

    // ไม่ควรส่ง passwordHash กลับไป
    const userResponse = {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt
    };

    // 201 Created
    return NextResponse.json({ message: 'User registered successfully. Please verify your email.', user: userResponse }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    // Send generic error message
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}