import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 1️⃣ Save to Neon DB (Contact table)
    await prisma.contact.create({
      data: { name, email, message },
    });

    // 2️⃣ Send email notification via Resend
    await resend.emails.send({
      from: "sandbox@resend.dev", // you can change domain if verified
      to: "bitbybit116@gmail.com", // <-- put your email here
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <hr />
        <p><small>Received on ${new Date().toLocaleString()}</small></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}