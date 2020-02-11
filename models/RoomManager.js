const Room = require('../models/Room');

let RoomManager = class {

    constructor(io) {
        this.rooms = [];

        io.on('connection', (socket)=> {

            socket.on('join', (data) => {
                // Send the player to a room
                let joined = false;
                for (let i = 0; i < this.rooms.length && !joined; i++) {
                    let room = this.rooms[i];
                    // console.log(`Checking room ${room.id}: ${room.isFull ? 'full' : 'not full'} (${room.playerList.players.length})`);

                    // If room is not full, add player
                    if (!room.isFull) {
                        room.join(data, socket);
                        joined = true;
                    }
                }

                // If player has not been added to a room (all full or no rooms), create new room
                if (!joined)
                {
                    let room = new Room();
                    this.rooms.push(room);
                    room.join(data, socket);
                }
            });
        });
    }

    get players() { return this.rooms.map(e => e.players).flat(); }

    update() {
        let i = 0;
        while (i < this.rooms.length) {
            // If room is empty, remove it;
            // Otherwise, update it and move on
            if (this.rooms[i].isEmpty) {
                console.log(`Deleting empty room ${this.rooms[i].id}`);
                this.rooms.splice(i, 1);
            } else {
                this.rooms[i].update();
                i++;
            }
        }
    }

    startGameLoop(fps) {
        let self = this;
        setInterval(()=>{ self.update() }, 1/fps);
    }

    getRoomById(id) {
        let room = this.rooms.find(e => e.id === id);
        return room;
    }

};

module.exports = RoomManager;