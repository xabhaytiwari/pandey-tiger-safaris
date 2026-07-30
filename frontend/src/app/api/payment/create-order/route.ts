import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount_inr, booking_id } = await req.json();

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({
        success: true,
        order_id: "order_demo_" + Math.random().toString(36).substring(7),
        amount: amount_inr * 100,
        currency: "INR",
        is_demo: true,
      });
    }

    // Razorpay API Order Creation Call
    const authHeader = "Basic " + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount_inr * 100, // Amount in paise (1 INR = 100 paise)
        currency: "INR",
        receipt: `receipt_${booking_id || Date.now()}`,
      }),
    });

    const orderData = await response.json();

    return NextResponse.json({
      success: true,
      order_id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
