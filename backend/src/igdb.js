const axios = require('axios');

const baseUrl = process.env.IGDB_API_URL;
const headers = { 'Accept': 'application/json', 'user-key': process.env.IGDB_KEY };

function apiCall(endpoint, body) {
    const url = `${baseUrl}${endpoint}`;
    return axios.post(url, body, { headers });
}

function searchGame(title) {
    const body = `fields name, popularity, cover.url, platforms.abbreviation, platforms.name; search "${title}"; limit 10;`;
    return apiCall('/games', body);
}

function getGameCover(id) {
    const body = `fields cover.image_id; where id = ${id};`;
    return apiCall('/games', body);
}

function anticipatedGames() {
    // get unix timestamp in seconds
    const today = Math.floor(Date.now() / 1000);
    const body = `fields first_release_date, name, summary, cover.url, genres.name, themes.name, platforms.abbreviation, platforms.name;
    limit 10;
    where first_release_date > ${today} & release_dates.category = 0;
    sort popularity desc;`;
    return apiCall('/games', body);
}

module.exports = { searchGame, getGameCover, anticipatedGames };
