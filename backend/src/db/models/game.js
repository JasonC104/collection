const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        platform: { type: String, required: true },
        cost: { type: Number, required: true },
        purchaseDate: { type: Date, default: new Date() },
        type: { type: String, required: true },
        rating: { type: Number, default: 0 },
        completed: { type: Boolean, default: false },
        gift: { type: Boolean, default: false },
        links: { type: [String], default: [] },
        igdbId: { type: Number, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Game', GameSchema);
