// src/app/api/verify-email/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { type NextRequest } from 'next/server' // Import NextRequest for type safety
import { PrismaClient } from '@prisma/client'; // Add this import for the transaction type

// Handler for GET requests (when user clicks the link)
export async function GET(request: NextRequest) {
  // Get the token from the URL query parameters
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  // 1. Check if token exists
  if (!token) {
    // Consider redirecting to an error page or returning JSON
    // return NextResponse.redirect(new URL('/verification-error?message=Missing token', request.url));
    return NextResponse.json({ message: 'Verification token is missing.' }, { status: 400 });
  }

  try {
    // Use a transaction to ensure atomicity (all operations succeed or fail together)
    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => {
      // 2. Find the token in the database
      // We use findFirst here as token should be unique but isn't explicitly marked as @unique in base schema
      const verificationToken = await tx.verificationToken.findFirst({
        where: { token: token },
      });

      // 3. Check if token is found
      if (!verificationToken) {
        // throw new Error('Invalid verification token.'); // Throw error to abort transaction
         return { status: 400, message: 'Invalid verification token.' }; // Or return error object
      }

      // 4. Check if token is expired
      const hasExpired = new Date() > new Date(verificationToken.expires);
      if (hasExpired) {
        // Optionally delete the expired token
        await tx.verificationToken.delete({
          where: {
              // Need the composite key or a unique field to delete
              // Let's assume token itself is unique enough for this purpose,
              // or adjust schema/query if needed (e.g., find by token, then delete by identifier+token)
              identifier_token: { // Assuming default composite key name, adjust if different
                  identifier: verificationToken.identifier,
                  token: verificationToken.token
              }
          },
        });
        // throw new Error('Verification token has expired.'); // Throw error to abort transaction
        return { status: 400, message: 'Verification token has expired.' }; // Or return error object
      }

      // 5. Find the user associated with the token's identifier (email)
      const user = await tx.user.findUnique({
          where: { email: verificationToken.identifier }
      });

      if (!user) {
          // This case should ideally not happen if token exists, but good to check
          // throw new Error('User not found for this token.');
          return { status: 404, message: 'User not found for this token.' };
      }

      // 6. Update the user's emailVerified status
      await tx.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() }, // Set to current timestamp
      });

      // 7. Delete the used verification token
      await tx.verificationToken.delete({
        where: {
          identifier_token: { // Use the composite key
              identifier: verificationToken.identifier,
              token: verificationToken.token
          }
        },
      });

      // If all steps succeed within the transaction
      // return { status: 200, message: 'Email verified successfully.' };
      return { status: 200, message: 'Email verified successfully.' };
    }); // End of transaction

    // Check the result returned from the transaction
    if (result.status !== 200) {
        return NextResponse.json({ message: result.message }, { status: result.status });
    }

    // --- Success Case ---
    // Optional: Redirect to a success page instead of returning JSON
    // const successUrl = new URL('/verification-success', request.url);
    // return NextResponse.redirect(successUrl);

    // Return JSON success response
    return NextResponse.json({ message: 'Email verified successfully!' }, { status: 200 });

  } catch (error) {
    console.error("Verification Error:", error);
    // Consider more specific error handling based on transaction failure if needed
    // if (error.message.includes('Invalid verification token')) {
    //     return NextResponse.json({ message: 'Invalid verification token.' }, { status: 400 });
    // }
    // if (error.message.includes('Verification token has expired')) {
    //     return NextResponse.json({ message: 'Verification token has expired.' }, { status: 400 });
    // }
    return NextResponse.json({ message: 'An error occurred during email verification.' }, { status: 500 });
  }
}