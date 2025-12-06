const replayReader = require('fortnite-replay-parser');
const handleEventEmitter = require('../exports/handleEventEmitter');
const NetFieldExports = require('../NetFieldExports');
const customClasses = require('../Classes');
const fs = require('fs'); // only for fallback if needed
const path = require('path'); // optional

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST allowed' });
    }

    const { base64 } = req.body;

    if (!base64) {
      return res.status(400).json({ error: "Missing 'base64' replay data" });
    }

    // Decode Base64 → Buffer (no disk write)
    const replayBinary = Buffer.from(base64, 'base64');

    // Parse replay
    const replay = await replayReader(replayBinary, {
      handleEventEmitter,
      customNetFieldExports: NetFieldExports,
      onlyUseCustomNetFieldExports: true,
      customClasses,
    });

    // Extract players, remove bots
    const players = (replay.gameData?.players ?? []).filter(p => !p.bIsABot);

    const playerStats = players.map(p => ({
      player_name: p.PlayerNamePrivate ?? p.PlayerName ?? "Unknown",
      eliminations: p.KillScore ?? p.Kills ?? 0,
      placement: p.Place ?? p.Placement ?? 0,
    }));

    return res.status(200).json(playerSta
