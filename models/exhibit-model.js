const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exhibitSchema = new Schema({
    name : String,
    rating: Number,
    url: String,
    picId: Number,
    adminCode: String

});

const Exhibit = mongoose.model('exhibit', exhibitSchema);

module.exports = Exhibit;