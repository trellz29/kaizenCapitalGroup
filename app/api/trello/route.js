import { NextResponse } from "next/server";

const TRELLO_KEY   = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID     = process.env.TRELLO_BOARD_ID || "uindORRd";

let LIST_ID_CACHE = null;

async function getFirstListId() {
  if (LIST_ID_CACHE) return LIST_ID_CACHE;
  const res = await fetch(
    `https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
  );
  const lists = await res.json();
  LIST_ID_CACHE = lists[0]?.id;
  return LIST_ID_CACHE;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, name, email, telegram, interest, source } = body;

    const listId = await getFirstListId();
    if (!listId) return NextResponse.json({ error: "No list found" }, { status: 500 });

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const title = `${name || email || "Unknown"} — ${type}`;
    const desc = [
      `📋 Source: ${source || "KCG Website"}`,
      `📧 Email: ${email || "—"}`,
      `👤 Name: ${name || "—"}`,
      telegram ? `✈️ Telegram: ${telegram}` : null,
      interest ? `💼 Interest: ${interest}` : null,
      `🕐 Time: ${timestamp}`,
    ].filter(Boolean).join("\n");

    const res = await fetch(
      `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idList: listId, name: title, desc, pos: "top" }),
      }
    );

    const card = await res.json();
    return card.id
      ? NextResponse.json({ success: true, cardId: card.id })
      : NextResponse.json({ error: "Failed", detail: card }, { status: 500 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
