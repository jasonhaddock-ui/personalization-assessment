// api/subscribe.js
// Vercel serverless function -- proxies form data to Mailchimp
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { firstName, lastName, email, maturityTier, overallScore } = req.body;
  if (!firstName || !lastName || !email || !maturityTier) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const MAILCHIMP_DC = process.env.MAILCHIMP_DC;
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_DC) {
    console.error("Missing Mailchimp environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }
  const url = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
  const body = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
      TIER: maturityTier,
      SCORE: String(overallScore),
    },
    tags: ["personalization-assessment", maturityTier],
  };
  try {
    const mcRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
      },
      body: JSON.stringify(body),
    });
    const data = await mcRes.json();
    if (!mcRes.ok && data.title !== "Member Exists") {
      console.error("Mailchimp error:", data);
      return res.status(400).json({ error: data.detail || "Mailchimp error" });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Subscribe handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
