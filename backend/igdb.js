const axios = require('axios');

const baseUrl = 'https://api-v3.igdb.com';
const headers = { 'Accept': 'application/json', 'user-key': process.env.USER_KEY };

function apiCall(endpoint, body) {
    const url = `${baseUrl}${endpoint}`;
    return axios.post(url, body, { headers });
}

function searchGame(title) {
    const body = `fields name, popularity, cover.url, platforms.abbreviation; search "${title}"; limit 5;`;
    return apiCall('/games', body);
}

function getGameCover(id) {
    const body = `fields cover.image_id; where id = ${id};`;
    return apiCall('/games', body);
}

module.exports = { searchGame, getGameCover };
