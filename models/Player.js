const Vector3 = require('./Vector3');
const Quaternion = require('./Quaternion');

let Player = class {
	constructor(socket, name, color) {
		this.socket = socket;
		this.name = name;
		this.color = color;

		this.facing = 1;

		this.position = new Vector3();
		this.rotation = new Quaternion();
		this.scale = new Vector3();

		this.send = (event, data)=>{ console.log(`Send {${event}, ${data}: Not yet implemented`)};

		this.socket.on('update', (data)=>{
			let dataJSON = JSON.parse(data);

			this.position = Vector3.fromObject(dataJSON.position);
			this.rotation = Quaternion.fromObject(dataJSON.rotation);
			this.scale = Vector3.fromObject(dataJSON.scale);

			this.facing = dataJSON.facing;
		});

		this.socket.on('event', (data)=>{
			let dataJSON = JSON.parse(data);

			this.send(dataJSON.eventName, dataJSON.eventData);
		});
	}

	update() {
		// pass
	}

	get data() {
		return {
			name: this.name,
			color: this.color,
			position: this.position,
			rotation: this.rotation,
			scale: this.scale,
			facing: this.facing,

			// Socket info for Unity
			socketId: this.socket.id,
			socketPing: this.socket.ping
		}
	}

};

module.exports = Player;