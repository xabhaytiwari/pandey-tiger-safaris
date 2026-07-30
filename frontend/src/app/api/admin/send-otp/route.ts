import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { otp } = await req.json();
    const targetEmail = "singhabhaytiwari@gmail.com";

    // EmailJS / Web Mailer Integration
    const emailJsServiceId = process.env.EMAILJS_SERVICE_ID;
    const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailJsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

    if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          template_params: {
            to_email: targetEmail,
            otp: otp,
            site_name: "Pandey Tiger Safaris Admin"
          },
        }),
      });
    }

    console.log(`[2FA SECURITY ALERT] OTP Code ${otp} generated for ${targetEmail}`);

    return NextResponse.json({
      success: true,
      message: `2FA OTP dispatched to ${targetEmail}`,
      sentTo: targetEmail
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
