const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	order: Array,
	i: Number,
	j: Number,
	k: Number,
	choice: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;


