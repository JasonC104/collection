const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
	{
		title: String,
		platform: String,
		cost: Number,
		rating: String,
		igdbId: Number,
		imageHash: String
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Item', ItemSchema);
