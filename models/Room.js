const crypto = require('crypto');
const stream = require('stream');
const Filter = require('bad-words');

const Player = require('../models/Player');
const PlayerList = require('../models/PlayerList');
const InstrumentHelper = require('../models/InstrumentHelper');

const config = require('../config');

const filter = new Filter({ placeHolder: ':)' });
filter.removeWords('hell', 'hells');

let Room = class {

    constructor() {
        this.id = crypto.randomBytes(Math.ceil(config.room.idLength/2))
            .toString('hex')
            .slice(0, config.room.idLength);

        this.streamInput = this.setUpStream();

        this.playerList = new PlayerList({
            "sound": (data)=>{this.onSound(data)}
        });
    }

    get stream() { return this.streamInput; }
    get players() { return this.playerList.players.map(e => e.data); }

    get isFull() { return this.playerList.players.length >= config.room.playerLimit; }
    get isEmpty() { return this.playerList.players.length === 0; }

    onSound(data) {
        InstrumentHelper.streamInstrument(data.sound, this.streamInput);
    }

    setUpStream()
    {
        class InstrumentStream extends stream.Transform {
            constructor(name, options) {
                super(options);
                this.name = name;
                this.count = 0;
            }


            _transform(chunk, encoding, done) {
                this.push(chunk);
                // console.log(`${this.name} writes ${chunk.length}`);
                done();
            }
        }

        let inputStream = new InstrumentStream('instrumentStream');

        // enable flow
        inputStream.on('data', (data)=>{
            this.playerList.emitAll('audioData', data);
        });

        inputStream.on('error', (e)=>{
            console.log(`Error streaming to input: ${e}`)
        });

        return inputStream;
    }

    join(data, socket)
    {
        let dataJSON = JSON.parse(data);

        // Filter name
        dataJSON.name = filter.clean(dataJSON.name);

        console.log(`Player ${dataJSON.name} joined room ${this.id} (data: ${data})`);
        let player = new Player(socket, dataJSON.name, dataJSON.color);

        // Send room ID to player
        socket.emit('joinedRoom', {"id":this.id});

        // Set up audio stream
        this.stream.sendToClient = (data)=>{
           socket.emit('audioData', data.toString('base64'));
        };

        this.playerList.join(player);
    }

    update() { this.playerList.update(); }
};

module.exports = Room;