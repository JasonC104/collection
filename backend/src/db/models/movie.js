const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        summary: { type: String, default: '' },
        watchedOnDate: { type: Date, default: new Date() },
        rating: { type: Number, default: 0 },
        genres: { type: [String], default: [] },
        links: { type: [String], default: [] },
        apiId: { type: Number, required: true },
        imageId: { type: String, default: '' }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Movie', MovieSchema);
