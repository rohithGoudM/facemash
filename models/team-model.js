const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
	teamName: String,
	teamCode: String,
	teamScore: Number,
	noOfMem: Number

});

const Team = mongoose.model('team', teamSchema);

module.exports = Team;