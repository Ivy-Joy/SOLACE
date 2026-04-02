//adapter (twilio + sendgrid)
import fetch from "node-fetch";

type Notification = {
  to?: string;
  toAdmin?: boolean; // send to configured admin contact
  channel?: "sms" | "whatsapp" | "email";
  message?: string;
  subject?: string;
};

export async function queueNotification(n: Notification) {
  // For now: fire-and-forget. In production, push into a queue (BullMQ) and process workers.
  return sendNotification(n).catch(err => {
    console.error("notify error", err);
  });
}

async function sendNotification(n: Notification) {
  const TWILIO_SID = process.env.TWILIO_SID;
  const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
  const TWILIO_FROM = process.env.TWILIO_FROM;
  const SENDGRID_KEY = process.env.SENDGRID_KEY;
  if (n.channel === "sms" && TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM && n.to) {
    const body = new URLSearchParams({
      Body: n.message || "",
      From: TWILIO_FROM,
      To: n.to
    });
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString()
    });
    return;
  }

  if (n.channel === "email" && SENDGRID_KEY && n.to) {
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${SENDGRID_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: n.to }] }],
        from: { email: process.env.NOTIFY_FROM || "no-reply@solace.org", name: "SOLACE" },
        subject: n.subject || "Notification from SOLACE",
        content: [{ type: "text/plain", value: n.message || "" }]
      })
    });
    return;
  }

  // fallback: log (or send to admin email)
  console.log("notification:", n);
}