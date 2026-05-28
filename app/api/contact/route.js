import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const TRELLO_LIST_ID = '69dd658b7a468e2c65dd1d75';

export async function POST(request) {
  try {
    const { name, email, inquiryType, capitalLevel, message } = await request.json();

    // Send email via Resend
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

    // Create Trello card
    const cardDesc = `Email: ${email}\nInquiry Type: ${inquiryType}\nCapital Level: ${capitalLevel}\n\nMessage:\n${message}`;
    await fetch(`https://api.trello.com/1/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${name} - ${inquiryType}`,
        desc: cardDesc,
        idList: TRELLO_LIST_ID,
      }),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
