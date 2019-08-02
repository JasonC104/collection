const IgdbApi = require('../api/igdb');
const csvParser = require('../csv-parser');
const Game = require('../db/models/game');
const convertDateToString = require('../utils').convertDateToString;

// populate igdbCache on startup. 
let igdbCache = {}; // { [igdbId]: dataObject }
Game.find({})
    .select('igdbId')
    .exec((err, data) => {
        if (err) { console.log(err); return; }

        igdbCache = {};
        while (data.length > 0) {
            const igdbIds = data.splice(0, 10).map(e => e.igdbId).join(',');
            getAndParse(IgdbApi.getGamesInfo, igdbIds)
                .then(data => data.forEach(e => igdbCache[e.igdbId] = e))
                .catch(err => console.log(err));
        }
    });

function getImageUrl(size, imageId) {
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

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

function parseIgdbGame(e) {
    const data = { igdbId: e.id };
    data.title = e.name || '';
    data.summary = e.summary || '';
    data.releaseDate = (e.first_release_date) ? convertDateToString(new Date(e.first_release_date * 1000)) : '';
    data.platforms = (e.platforms) ? e.platforms.map(p => p.abbreviation ? p.abbreviation : p.name) : [];
    data.genres = (e.genres) ? e.genres.map(g => g.name) : [];
    data.themes = (e.themes) ? e.themes.map(t => t.name) : [];
    if (e.popularity) data.popularity = e.popularity;

    data.image = {};
    [
        { label: 'portrait', size: '720p' },
        { label: 'uniform', size: 'cover_uniform' },
        { label: 'thumb', size: 'thumb' }
    ].forEach(i => data.image[i.label] = (e.cover && e.cover.image_id) ? getImageUrl(i.size, e.cover.image_id) : '');

    return data;
}

/**
 * Performs the api call with the params and returns the parsed data
 * @param {*} apiCall 
 * @param  {...any} params 
 */
function getAndParse(apiCall, ...params) {
    return new Promise((resolve, reject) => {
        apiCall(...params)
            .then(response => {
                resolve(
                    response.data.map(e => parseIgdbGame(e))
                );
            }).catch(err => { console.log(err); reject(err); });
    });
}

/////////////// Exported Functions ///////////////

function getGamesCollection(req, res) {
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
            if (err) { console.log(err); return res.json({ error: err }) };

            const result = data.map(e => {
                // merge the igdb information with the record in the db 
                const game = { ...igdbCache[e.igdbId], ...parseDatabaseGame(e) };
                return game;
            });
            return res.json({ data: result });
        });
}

function addGameToCollection(req, res) {
    const item = req.body;
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

    // add igdb information on the new game to the cache
    getAndParse(IgdbApi.getGamesInfo, item.igdbId)
        .then(data => {
            if (data.length === 1)
                return data[0];
            res.json('Invalid igdb id');
            return Promise.reject('Invalid igdb id');
        }).then(data => {
            game.save((err, doc) => {
                if (err) { console.log(err); return res.json({ error: err }); }

                console.log(doc);
                igdbCache[data.igdbId] = data;
                return res.json({ success: true });
            });
        }).catch(err => console.log(err));
}

function updateGameInCollection(req, res) {
    const body = req.body;
    const update = {};
    if (body.rating !== undefined && typeof body.rating === 'number') update.rating = body.rating;
    if (body.completed !== undefined && typeof body.completed === 'boolean') update.completed = body.completed;
    if (body.gift !== undefined && typeof body.gift === 'boolean') update.gift = body.gift;

    if (Object.keys(update).length > 0) {
        Game.findOneAndUpdate({ _id: body.id }, update, err => {
            if (err) return res.send(err);
            console.log(`updated ${body.id}`);
            console.log(update);
            return res.json({ success: true });
        });
    } else {
        return res.send('No update');
    }
}

function deleteGameFromCollection(req, res) {
    Game.findOneAndDelete({ _id: req.body.id }, (err, data) => {
        if (err) { console.log(err); return res.send(err) };

        console.log(`deleted ${req.body.id}`);
        console.log(data);
        return res.json({ success: true });
    });
}

function searchGames(req, res) {
    getAndParse(IgdbApi.searchGame, req.params.title)
        .then(data => res.json(
            data.sort((a, b) => b.popularity - a.popularity)
        ))
        .catch(err => res.json(err));
}

function getAnticipatedGames(req, res) {
    getAndParse(IgdbApi.anticipatedGames)
        .then(data => res.json(data))
        .catch(err => res.json(err));
}

function getHighlyRatedGames(req, res) {
    getAndParse(IgdbApi.highlyRated)
        .then(data => res.json(data))
        .catch(err => res.json(err));
}

function getRecentlyReleasedGames(req, res) {
    getAndParse(IgdbApi.recentlyReleased)
        .then(data => res.json(data))
        .catch(err => res.json(err));
}

function exportGamesToCsv(req, res) {
    Game.find()
        .sort({ purchaseDate: 1 })
        .exec((err, data) => {
            if (err) { console.log(err); return res.json({ error: err }) };

            const csv = csvParser.itemDataToCsv(data);
            res.attachment('item-data.csv');
            return res.status(200).type('text/csv').send(csv);
        });
}

module.exports = {
    getGamesCollection, addGameToCollection, updateGameInCollection, deleteGameFromCollection,
    searchGames, getAnticipatedGames, getHighlyRatedGames, getRecentlyReleasedGames, exportGamesToCsv
};
