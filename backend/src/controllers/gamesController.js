const Api = require('../api/igdb');
const csvParser = require('../csv-parser');
const Game = require('../db/models/game');
const convertDateToString = require('../utils').convertDateToString;
const handleError = require('../utils').handleError;

// populate igdbCache on startup. 
let igdbCache = {}; // { [igdbId]: dataObject }
Game.find({})
    .select('igdbId')
    .exec((err, data) => {
        if (err) { console.log(err); return; }

        igdbCache = {};
        while (data.length > 0) {
            const igdbIds = data.splice(0, 10).map(e => e.igdbId).join(',');
            Api.getItem(igdbIds)
                .then(data => data.forEach(e => igdbCache[e.igdbId] = e))
                .catch(err => console.log(err));
        }
    });

function parseDatabaseGame(e) {
    return {
        id: e._id,
        title: e.title,
        platform: e.platform,
        cost: e.cost,
        purchaseDate: convertDateToString(e.purchaseDate),
        type: e.type,
        rating: e.rating,
        completed: e.completed,
        gift: e.gift,
        links: e.links,
        igdbId: e.igdbId,
    };
}

/////////////// Exported Functions ///////////////

function getCollection(req, res) {
    const query = req.query;
    const requirements = {};

    // search
    if (query.search && typeof query.search === 'string') {
        requirements.title = new RegExp(query.search, 'i');
    }

    // filter
    if (query.platform && Array.isArray(query.platform)) {
        requirements.platform = { $in: query.platform };
    }

    // sort
    const order = (query.order === 'desc') ? -1 : 1;
    const sortRequirements = (query.sort && typeof query.sort === 'string')
        ? { [query.sort]: order } : { purchaseDate: -1 };

    Game.find(requirements)
        .sort(sortRequirements)
        .exec((err, data) => {
            if (err) return handleError(res, err);

            const result = data.map(e => {
                // merge the igdb information with the record in the db 
                const game = { ...igdbCache[e.igdbId], ...parseDatabaseGame(e) };
                return game;
            });
            return res.json(result);
        });
}

function addToCollection(req, res) {
    const item = req.body;

    // add igdb information on the new game to the cache
    Api.getItem(item.igdbId)
        .then(data => {
            if (data.length === 1) return data[0];

            res.status(400).json('Invalid igdb id');
            return Promise.reject('Invalid igdb id');
        }).then(data => {
            // TODO data validation
            const game = new Game({
                title: item.title,
                platform: item.platform,
                cost: item.cost,
                purchaseDate: item.purchaseDate,
                type: item.type,
                completed: item.completed,
                gift: item.gift,
                rating: item.rating,
                links: item.links,
                igdbId: item.igdbId
            });

            game.save((err, doc) => {
                if (err) return handleError(res, err)

                console.log(doc);
                igdbCache[data.igdbId] = data;
                return res.json({ success: true });
            });
        }).catch(err => handleError(res, err));
}

function updateItemInCollection(req, res) {
    const body = req.body;
    if (!body.id) return res.status(400).json('id must be given');

    const update = {};
    if (body.rating !== undefined && typeof body.rating === 'number') update.rating = body.rating;
    if (body.completed !== undefined && typeof body.completed === 'boolean') update.completed = body.completed;
    if (body.gift !== undefined && typeof body.gift === 'boolean') update.gift = body.gift;

    if (Object.keys(update).length > 0) {
        Game.findOneAndUpdate({ _id: body.id }, update, err => {
            if (err) return handleError(res, err);

            console.log(`updated ${body.id}`);
            console.log(update);
            return res.json({ success: true });
        });
    } else {
        return res.json('No update');
    }
}

function deleteFromCollection(req, res) {
    const id = req.params.id;
    if (!id) return res.status(400).json('id must be given');

    Game.findOneAndDelete({ _id: id }, (err, data) => {
        if (err) return handleError(res, err);

        console.log(`deleted ${id}`);
        console.log(data);
        return res.json({ success: true });
    });
}

function search(req, res) {
    Api.search(req.params.title)
        .then(data => res.json(data))
        .catch(err => handleError(res, err));
}

function getAnticipated(req, res) {
    Api.getAnticipated()
        .then(data => res.json(data))
        .catch(err => handleError(res, err));
}

function getHighlyRated(req, res) {
    Api.getHighlyRated()
        .then(data => res.json(data))
        .catch(err => handleError(res, err));
}

function getRecentlyReleased(req, res) {
    Api.getRecentlyReleased()
        .then(data => res.json(data))
        .catch(err => handleError(res, err));
}

function exportToCsv(req, res) {
    Game.find()
        .sort({ purchaseDate: 1 })
        .exec((err, data) => {
            if (err) return handleError(res, err);

            const csv = csvParser.itemDataToCsv(data);
            res.attachment('item-data.csv');
            return res.status(200).type('text/csv').send(csv);
        });
}

module.exports = {
    getCollection, addToCollection, updateItemInCollection, deleteFromCollection,
    search, getAnticipated, getHighlyRated, getRecentlyReleased, exportToCsv
};
