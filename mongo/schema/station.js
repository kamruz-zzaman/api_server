const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
    StationName: String,
    StationFreq: String
});

module.exports = mongoose.model(
    'station', StationSchema, 'stations');