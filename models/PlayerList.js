let PlayerList = class PlayerList {
	constructor(eventHandler) {
		this.players = [];

		this.eventHandler = eventHandler;
	}

	join(player) {
		this.players.push(player);

		this.emitAll('join', player.data);

		player.send = (event, data) => {
			this.emitAll('event', {eventName: event, eventData: data});
		};

		player.socket.on('serverEvent', (data) => {
			let dataJSON = JSON.parse(data);

			this.eventHandler[dataJSON.eventName](JSON.parse(dataJSON.eventData));
		});

		player.socket.on('disconnect', ()=>{
			this.players.splice(this.players.findIndex(a => a.socket.id === player.socket.id), 1);
			// console.log(`Player ${player.name} disconnected`);

			this.emitAll('leave', player.data);
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
		let playerList = { players: [] };
		for (let data of this.players.map(player => player.data))
		{
			playerList.players.push({ id: data.socketId, playerData: data });
		}
		this.emitAll('update', playerList);
	}

	emitAll(event, data) {
		for (let player of this.players) {
			player.socket.emit(event, data);
		}
	}

};

module.exports = PlayerList;