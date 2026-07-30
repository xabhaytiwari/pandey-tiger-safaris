import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { otp } = await req.json();
    const targetEmail = "singhabhaytiwari@gmail.com";
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Pandey Tiger Safaris <onboarding@resend.dev>",
          to: [targetEmail],
          subject: `Admin 2FA Security OTP Code: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #09090b; color: #ffffff; border-radius: 12px; max-width: 500px; border: 1px solid #27272a;">
              <h2 style="color: #f59e0b; margin-top: 0;">Pandey Tiger Safaris Admin</h2>
              <p style="color: #a1a1aa; font-size: 14px;">Your 2FA Verification Code to unlock the Owner Dashboard is:</p>
              <div style="background-color: #18181b; border: 1px solid #3f3f46; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f59e0b; font-family: monospace;">${otp}</span>
              </div>
              <p style="color: #71717a; font-size: 12px;">Sent to: ${targetEmail}</p>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: `2FA OTP dispatched to ${targetEmail}`,
      otp: otp // Included for testing
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
