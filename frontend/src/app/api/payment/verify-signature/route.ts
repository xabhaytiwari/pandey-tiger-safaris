import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customer_email,
      customer_name,
      park_name,
      booking_date,
      safari_slot,
      amount_paid_inr,
      balance_due_inr
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const resendApiKey = process.env.RESEND_API_KEY;

    // Verify HMAC SHA-256 Signature
    if (secret) {
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Send Automated Guest Email Receipt via Resend
    if (resendApiKey && customer_email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Pandey Tiger Safaris <onboarding@resend.dev>",
          to: [customer_email],
          subject: `Safari Booking Confirmed - ${park_name} (${booking_date})`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #09090b; color: #ffffff; border-radius: 12px; max-width: 550px; border: 1px solid #27272a;">
              <h2 style="color: #f59e0b; margin-top: 0;">Pandey Tiger Safaris</h2>
              <p style="color: #e4e4e7; font-size: 14px;">Dear <strong>${customer_name || "Guest"}</strong>,</p>
              <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5;">
                Your tiger safari booking for <strong>${park_name}</strong> has been successfully confirmed and prepaid.
              </p>
              
              <div style="background-color: #18181b; border: 1px solid #3f3f46; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; line-height: 1.8;">
                <p style="margin: 0; color: #f59e0b; font-weight: bold;">Safari Details:</p>
                <p style="margin: 0;">• Park: ${park_name}</p>
                <p style="margin: 0;">• Date: ${booking_date}</p>
                <p style="margin: 0;">• Slot: ${safari_slot || "Morning Safari"}</p>
                <p style="margin: 0;">• Amount Paid: ₹${amount_paid_inr?.toLocaleString("en-IN") || 0}</p>
                ${balance_due_inr > 0 ? `<p style="margin: 0; color: #f59e0b;">• Balance Due on Arrival: ₹${balance_due_inr?.toLocaleString("en-IN")}</p>` : ''}
                <p style="margin: 0; color: #a1a1aa;">• Payment Ref: ${razorpay_payment_id || "Prepaid"}</p>
              </div>

              <p style="color: #a1a1aa; font-size: 12px;">
                For gate entry & permit assistance, contact business owner <strong>Dinesh Pandey (+91 9425331205)</strong> at Tala Gate HQ.
              </p>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true, message: "Payment verified and customer receipt sent" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
