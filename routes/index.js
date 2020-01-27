const express = require('express');

const config = require('../config');
const Player = require('../models/Player');
const PlayerList = require('../models/PlayerList');

var io = require('socket.io')({
  transports: ['websocket'],
});
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'jam sesh' });
});

let playerList;
io.on('connection', (socket)=>{
  // console.log(`Connection from ${socket.id}`);

  let player;
  socket.on('join', (data) => {
    // console.log(`Player ${data.name} joined`);
    player = new Player(socket, data.name, data.color);

    if (playerList == null) { playerList = new PlayerList(); }
    playerList.join(player);
  });
});

function gameLoop() {
  if (!playerList) { return; }
  if (playerList.players.length === 0) { playerList = null; return; }

  playerList.update();
}

let gameLoopInterval = setInterval(gameLoop, 1/config.fps);

router.io = io;

module.exports = router;
