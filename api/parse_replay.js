import formidable from 'formidable';
import fs from 'fs';
import replayReader from 'fortnite-replay-parser';
import handleEventEmitter from '../exports/handleEventEmitter.js';
import NetFieldExports from '../exports/NetFieldExports.js';
import customClasses from '../exports/Classes.js';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const replayFile = files?.replay;
    if (!replayFile) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const replayBinary = fs.readFileSync(replayFile.filepath);
      const replay = await replayReader(replayBinary, {
        handleEventEmitter,
        customNetFieldExports: NetFieldExports,
        onlyUseCustomNetFieldExports: true,
        customClasses
      });

      const players = replay.gameData?.players ?? [];
      const playerStats = players.map(player => ({
        player_name: player.PlayerNamePrivate ?? player.PlayerName ?? 'Unknown',
        eliminations: player.KillScore ?? player.Kills ?? 0,
        placement: player.Place ?? player.Placement ?? 0
      }));

      res.status(200).json(playerStats);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
