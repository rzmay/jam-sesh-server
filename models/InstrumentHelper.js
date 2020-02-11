const fs = require('fs');
const util = require('util');
const path = require('path');

const config = require('../config');

let InstrumentHelper = {
    _instruments: []
};

InstrumentHelper._readInstruments = async function() {
    const readdir = util.promisify(fs.readdir);

    this._instruments = await readdir(config.instrumentPath);
};

InstrumentHelper._getInstrument = async function (index) {
    if (this._instruments.length === 0) { await this._readInstruments(); }
    if (index >= this._instruments.length) index = 0;

    return this._instruments[index];
};

InstrumentHelper.sendInstrument = async function(index, res) {
    const instrument = await this._getInstrument(index);

    res.sendFile(path.join(__dirname, '..', config.instrumentPath, instrument));
};

InstrumentHelper.streamInstrument = async function(index, input) {
    const instrument = await this._getInstrument(index);
    const readFile = util.promisify(fs.readFile);

    let audio = await readFile(path.join(__dirname, '..', config.instrumentPath, instrument));
    let b64 = audio.toString('base64');

    // Close stream on end
    input.sendToClient(b64);
};

module.exports = InstrumentHelper;