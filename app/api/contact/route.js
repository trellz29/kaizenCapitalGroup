import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, inquiryType, capitalLevel, message } = await request.json();

    await resend.emails.send({
      from: 'KCG Website <support@kaizencapitalgrp.com>',
      to: 'support@kaizencapitalgrp.com',
      subject: `New Investor Inquiry from ${name}`,
      html: `
        <h2>New Investor Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <p><strong>Capital Level:</strong> ${capitalLevel}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
