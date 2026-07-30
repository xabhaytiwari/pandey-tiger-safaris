import { NextResponse } from "next/server";
import crypto from "crypto";

function timingSafeCheck(a: string, b: string) {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME || "dinesh_pandey";
    const expectedPassword = process.env.ADMIN_PASSWORD || "PandeyTiger@2026#";

    const isUsernameValid = timingSafeCheck(username || "", expectedUsername);
    const isPasswordValid = timingSafeCheck(password || "", expectedPassword);

    if (!isUsernameValid || !isPasswordValid) {
      return NextResponse.json({ success: false, error: "Invalid Admin Credentials" }, { status: 401 });
    }

    const targetEmail = "singhabhaytiwari@gmail.com";
    const apiKey = process.env.RESEND_API_KEY;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP with SHA-256 before setting in HTTP-only cookie
    const secretPepper = process.env.RAZORPAY_KEY_SECRET || "pandey_tiger_secret_pepper";
    const otpHash = crypto.createHmac("sha256", secretPepper).update(otp).digest("hex");

    if (apiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Pandey Tiger Safaris Admin <onboarding@resend.dev>",
          to: [targetEmail],
          subject: `Admin 2FA Security OTP: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #09090b; color: #ffffff; border-radius: 12px; max-width: 500px; border: 1px solid #27272a;">
              <h2 style="color: #f59e0b; margin-top: 0;">Pandey Tiger Safaris Admin</h2>
              <p style="color: #a1a1aa; font-size: 14px;">Your 2FA Verification Code to unlock the Owner Dashboard is:</p>
              <div style="background-color: #18181b; border: 1px solid #3f3f46; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f59e0b; font-family: monospace;">${otp}</span>
              </div>
              <p style="color: #71717a; font-size: 12px;">Dispatched to: ${targetEmail}</p>
            </div>
          `,
        }),
      });
    }

    const response = NextResponse.json({
      success: true,
      message: `2FA Verification Code dispatched to ${targetEmail}`,
    });

    response.cookies.set("admin_otp_hash", otpHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 300,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
