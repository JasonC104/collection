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

const GameSchema = new Schema(
	{
		title: String,
		platform: String,
		cost: Number,
		purchaseDate: Date,
		type: String,
		rating: Number,
		completed: Boolean,
		gift: Boolean,
		links: [String],
		igdb: {
			id: Number,
			imageHash: String
		}
	},
	{
		timestamps: true
	}
);

module.exports = {
	Game: mongoose.model('Game', GameSchema)
};
