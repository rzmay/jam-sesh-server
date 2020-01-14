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
			this.position = Vector3.fromObject(data.position);
			this.rotation = Quaternion.fromObject(data.rotation);
			this.scale = Vector3.fromObject(data.scale);

			this.facing = data.facing;
		});

		this.socket.on('event', (data)=>{
			this.send(data.event, data.data);
		});
	}

	update() {
		// pass
	}

	get data() {
		return {
			socket: {
				id: this.socket.id,
				ping: this.socket.ping,
			},
			name: this.name,
			color: this.color,
			position: this.position,
			rotation: this.rotation,
			scale: this.scale,
			facing: this.facing
		}
	}

};

module.exports = Player;