let Vector3 = class {
	static fromObject(obj) {
		return new Vector3(
			parseFloat(obj.x),
			parseFloat(obj.y),
			parseFloat(obj.z)
		);
	}

	constructor(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
};

module.exports = Vector3;