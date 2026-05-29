export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, phone, capital, message } = await request.json();

    await resend.emails.send({
      from: "KCG Contact Form <support@kaizencapitalgrp.com>",
      to: "support@kaizencapitalgrp.com",
      subject: `KCG Investor Inquiry from ${name}`,
      html: `<h2>New Investor Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Capital:</strong> ${capital || "Not provided"}</p>
        <p><strong>Message:</strong> ${message}</p>`,
    });

    const trelloRes = await
cat > /Users/trellz/my-website/app/api/contact/route.js << 'EOF'
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, phone, capital, message } = await request.json();

    await resend.emails.send({
      from: "KCG Contact Form <support@kaizencapitalgrp.com>",
      to: "support@kaizencapitalgrp.com",
      subject: `KCG Investor Inquiry from ${name}`,
      html: `<h2>New Investor Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Capital:</strong> ${capital || "Not provided"}</p>
        <p><strong>Message:</strong> ${message}</p>`,
    });

    const trelloRes = await fetch(
      `https://api.trello.com/1/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idList: "69dd658b7a468e2c65dd1d75",
          name: `${name} – ${email}`,
          desc: `Phone: ${phone || "N/A"}\nCapital: ${capital || "N/A"}\nMessage: ${message}`,
        }),
      }
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
