module.exports = async (req, res) => {
  const secret = process.env.REPLAY_WEBHOOK_SECRET;
  const provided = req.headers['x-webhook-secret'];

  if (!secret || secret !== provided) {
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }

  console.log("Webhook received:", req.body);

  // Save to Supabase or DB here

  return res.status(200).json({ ok: true });
};
