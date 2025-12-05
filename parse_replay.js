const replayReader = require('fortnite-replay-parser');
const handleEventEmitter = require('./exports/handleEventEmitter');
const NetFieldExports = require('./NetFieldExports');
const customClasses = require('./Classes');
const fs = require('fs');
const path = require('path');

(async () => {
    const replayPath = process.argv[2];

    if (!replayPath) {
        console.error("❌ Please provide the path to the replay file.");
        process.exit(1);
    }

    if (!fs.existsSync(replayPath)) {
        console.error("❌ File does not exist:", replayPath);
        process.exit(1);
    }

    try {
        const replayBinary = fs.readFileSync(replayPath);

        const replay = await replayReader(replayBinary, {
            handleEventEmitter,
            customNetFieldExports: NetFieldExports,
            onlyUseCustomNetFieldExports: true,
            customClasses,
        });

        const players = replay.gameData?.players ?? [];
        const playerStats = players.map(player => ({
            player_name: player.PlayerNamePrivate ?? player.PlayerName ?? "Unknown",
            eliminations: player.KillScore ?? player.Kills ?? 0,
            placement: player.Place ?? player.Placement ?? 0
        }));

        console.log(JSON.stringify(playerStats));
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
})();
