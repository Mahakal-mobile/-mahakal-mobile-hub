// Vercel Serverless Function — keeps Gemini key on server
// Set Environment Variable: GEMINI_API_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set in Vercel Environment Variables' });
  }

  const { text, imageBase64, mimeType } = req.body || {};
  if (!text && !imageBase64) {
    return res.status(400).json({ error: 'text or image required' });
  }

  const SYSTEM = `You are a practical mobile motherboard repair expert.
Reply in simple Hindi (or English if user writes English).
Be direct. Give step-by-step repair advice.
Do NOT introduce yourself by name every time. Do NOT repeat brand names unnecessarily.
Focus on faults, IC names, voltage rails, short finding, temperatures, flashing steps.`;

  const parts = [];
  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: mimeType || 'image/jpeg',
        data: imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '')
      }
    });
  }
  parts.push({ text: SYSTEM + '\n\nUser: ' + (text || 'Analyze this board photo for faults and next steps.') });

  const models = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
  let lastError = '';

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: { temperature: 0.35, maxOutputTokens: 900 }
        })
      });
      const data = await r.json();
      if (!r.ok) {
        lastError = data?.error?.message || `HTTP ${r.status}`;
        continue;
      }
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return res.status(200).json({ text: reply });
      lastError = 'Empty reply from ' + model;
    } catch (e) {
      lastError = e.message || String(e);
    }
  }

  return res.status(502).json({ error: lastError || 'All models failed' });
}
