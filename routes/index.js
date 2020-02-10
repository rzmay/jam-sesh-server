const express = require('express');

const config = require('../config');
const RoomManager = require('../models/RoomManager');
const InstrumentHelper = require('../models/InstrumentHelper');


var io = require('socket.io')({
  transports: ['websocket'],
});

var roomManager = new RoomManager(io);
let gameLoopInterval = roomManager.startGameLoop(config.fps);

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'jam sesh' });
});

/* GET game page */
router.get('/play', function(req, res, next) {
  res.render('play', { title: 'jam sesh' })
});

/* GET instrument */
router.get('/instrument', function(req, res, next) {
  const index = req.query.i;
  InstrumentHelper.SendInstrument(index, res);
});

router.get('/streams/:room', function (req, res) {
  res.set({
    'Content-Type': 'audio/wav',
    'Transfer-Encoding': 'chunked'
  });

  let room = roomManager.getRoomById(req.params.room);
  if (room !== null) {
    room.stream.pipe(res);
  }
});

router.io = io;

module.exports = router;
