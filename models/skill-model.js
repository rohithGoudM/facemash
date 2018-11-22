const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
	skillName: String,
	categorie: String,
	location: String,
	picUrl: String,
	skillCreator: String,
	skillCreatorId: Schema.Types.ObjectId,
	skillDesc: String
});

const Skill = mongoose.model('skill', skillSchema);

module.exports = Skill;