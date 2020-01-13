const Player = require ('./Player');

let PlayerList = class PlayerList {
	constructor() {
		this.players = [];
	}

	join(player) {
		this.players.push(player);

		this.emitAll('join', player.data);

		let self = this;
		player.send = (event, data) => {
			self.emitAll('event', {event: event, data: data});
		};

		player.socket.on('disconnect', ()=>{
			self.players.splice(self.players.findIndex(a => a.socket.id === player.socket.id));

			self.emitAll('leave', player.data);
		});
	}

	update() {
		// Update all
		for (let player of this.players) {
			player.update();

			// DEBUG
			// console.log(`${player.name}: (${player.position.x}, ${player.position.y}, ${player.position.z})`)
		}

		// Send data
		let playerDict = { players: {} };
		for (let data of this.players.map(player => player.data))
		{
			playerDict.players[data.socket.id] = data;
		}
		this.emitAll('update', playerDict);
	}

	emitAll(event, data) {
		for (let player of this.players) {
			player.socket.emit(event, data);
		}
	}

};

module.exports = PlayerList;