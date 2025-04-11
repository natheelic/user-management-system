// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import instance ที่สร้างไว้
import bcrypt from "bcrypt";
import crypto from "crypto"; // Import crypto module for token generation
import { Resend } from "resend"; // Import Resend

// Instantiate Resend client outside the handler
// Make sure RESEND_API_KEY is set in your environment variables
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Basic Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // --- เพิ่ม Validation อื่นๆ ได้ตามต้องการ ---
    // เช่น ตรวจสอบรูปแบบ Email, ความยาว Password

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      ); // 409 Conflict
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

    // --- NEW: Email Verification Logic ---
    if (newUser && resend) {
      // Proceed only if user created and Resend is configured
      try {
        // 1. Generate Verification Token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiryHours = 24; // Token valid for 24 hours
        const expires = new Date(Date.now() + tokenExpiryHours * 3600 * 1000);

        // 2. Store Token in Database (using NextAuth schema: identifier, token, expires)
        // Note: Storing raw token here for simplicity in link generation.
        // Consider hashing the token before storing for enhanced security if needed.
        await prisma.verificationToken.create({
          data: {
            identifier: newUser.email!, // Email is the identifier
            token: rawToken, // Store the raw token
            expires: expires,
          },
        });

        // 3. Construct Verification URL
        // src/app/api/register/route.ts (ภายในฟังก์ชัน POST)
        const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${rawToken}`;

        // --- DEBUGGING LINES ---
        console.log("--- DEBUG INFO ---");
        console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
        console.log("Raw Token:", rawToken);
        console.log("Verification URL:", verificationUrl);
        console.log("Token Expiry Hours:", tokenExpiryHours);
        // --- END DEBUGGING LINES ---

        // 4. Create Email HTML using backticks
        const emailHtml = `
  <p>Welcome! Please click the link below to verify your email address:</p>
  <a href="${verificationUrl}">Verify Email</a>
  <p>This link will expire in ${tokenExpiryHours} hours.</p>
`;
        console.log("Generated emailHtml:", emailHtml); // ดูค่า html สุดท้ายก่อนส่ง

        // 5. Send Verification Email using Resend
        const { data, error: emailError } = await resend.emails.send({
          from: "Your App Name <noreply@eleccom.in.th>", // ตรวจสอบว่าใช้ domain ที่ verify แล้ว
          to: [newUser.email!],
          subject: "Verify Your Email Address",
          html: emailHtml,
        });

        // ... (ส่วนจัดการ error และ response) ...

        if (emailError) {
          console.error("Failed to send verification email:", emailError);
          // Optional: Decide how to handle email sending failure.
          // Maybe log it but still return success to user? Or return a specific error?
          // For now, we log it and continue.
        } else {
          console.log("Verification email sent successfully:", data);
        }
      } catch (verificationError) {
        console.error(
          "Error during verification token/email process:",
          verificationError
        );
        // Log error but proceed to return success to user for registration part
      }
    } else if (!resend) {
      console.warn(
        "Resend API Key not configured. Skipping email verification."
      );
    }
    // --- End of NEW Email Verification Logic ---

    // ไม่ควรส่ง passwordHash กลับไป
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    // 201 Created
    return NextResponse.json(
      {
        message: "User registered successfully. Please verify your email.",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    // Send generic error message
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
