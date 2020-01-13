let Quaternion = class {
	static fromObject(obj) {
		return new Quaternion(
			parseFloat(obj.x),
			parseFloat(obj.y),
			parseFloat(obj.z),
			parseFloat(obj.w)
		);
	}

	constructor(x, y, z, w) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 0;
	}
};

module.exports = Quaternion;