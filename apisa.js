const express = require('express');
const sampQuery = require('samp-query');
const app = express();

app.get('/api/samp', function (req, res) {
  const ip = req.query.ip;
  const port = req.query.port;
  const serverIp = `${ip}:${port}`;

  const options = {
    host: ip,
    port: port
  };

  sampQuery(options, function (error, response) {
    if (error) {
      res.status(404).json({ 'error': 'Terjadi kesalahan. Harap periksa IP dan port dengan benar atau coba lagi nanti.' });
    } else {
      function createPlayerList(players) {
        const indexLen = Math.floor(Math.log10(players.length - 1)) + 1;
        let nameLen = 0;
        for (const player of players) {
          if (player.name.length > nameLen) nameLen = player.name.length;
        }
        return players.map((player, i) => `${i}${" ".repeat(indexLen - `${i}`.length)} ${player.name}${" ".repeat(nameLen - player.name.length)} ${player.score}  ${player.ping}`).slice(0, 11).join("\n");
      }

      const playerList = createPlayerList(response.players);

      res.json({
        'response': {
          'serverIp': serverIp,
          'address': response.address,
          'hostname': response.hostname,
          'gamemode': response.gamemode,
          'language': response.mapname,
          'passworded': response.passworded,
          'maxplayers': response.maxplayers,
          'players': response.online,
          'rule': {
            'lagcomp': response.rules.lagcomp,
            'mapname': response.rules.mapname,
            'version': response.rules.version,
            'weather': response.rules.weather,
            'weburl': response.rules.weburl,
            'worldtime': response.rules.worldtime
          },
          'isPlayersIngame': playerList
        }
      });
    }
  });
});

app.get('*', function (req, res) {
  res.status(404).json({ '404': 'Tidak ditemukan! Masukkan IP dan Port.' });
});

app.listen(5000, () => console.log('Server berjalan di port 5000'));
