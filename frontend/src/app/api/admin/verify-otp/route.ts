import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { inputOtp } = await req.json();
    const cookieStore = cookies();
    const otpCookie = cookieStore.get("admin_otp_hash")?.value;

    if (!otpCookie) {
      return NextResponse.json({ success: false, error: "2FA session expired. Please sign in again." }, { status: 400 });
    }

    const expectedOtp = Buffer.from(otpCookie, "base64").toString("utf-8");

    if (inputOtp !== expectedOtp) {
      return NextResponse.json({ success: false, error: "Incorrect 2FA Code. Check singhabhaytiwari@gmail.com" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, message: "2FA Verified" });

    // Clear OTP cookie and set authenticated session
    response.cookies.delete("admin_otp_hash");
    response.cookies.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
