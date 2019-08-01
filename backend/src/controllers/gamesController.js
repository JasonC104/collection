const IgdbApi = require('../api/igdb');
const csvParser = require('../csv-parser');
const convertDateToString = require('../utils').convertDateToString;

function parseIgdbGame(e) {
    const data = { igdbId: e.id };
    data.title = e.name || '';
    data.summary = e.summary || '';
    data.imageUrl = (e.cover && e.cover.url) ? e.cover.url : '';
    data.releaseDate = (e.first_release_date) ? convertDateToString(new Date(e.first_release_date * 1000)) : '';
    data.platforms = (e.platforms) ? e.platforms.map(p => p.abbreviation ? p.abbreviation : p.name) : [];
    data.genres = (e.genres) ? e.genres.map(g => g.name) : [];
    data.themes = (e.themes) ? e.themes.map(t => t.name) : [];

    if (e.popularity) data.popularity = e.popularity;
    return data;
}

function getAndParse(apiCall, params = []) {
    return new Promise((resolve, reject) => {
        apiCall(...params)
            .then(response => {
                resolve(
                    response.data.map(e => parseIgdbGame(e))
                );
            }).catch(err => { console.log(err); reject(err); });
    });
}

function searchGames(req, res) {
    getAndParse(IgdbApi.searchGame, [req.params.title])
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

module.exports = { searchGames, getAnticipatedGames, getHighlyRatedGames, getRecentlyReleasedGames };
