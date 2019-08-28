const axios = require('axios');
const convertDateToString = require('../utils').convertDateToString;

const baseUrl = process.env.IGDB_API_URL;
const headers = { 'Accept': 'application/json', 'user-key': process.env.IGDB_KEY };

function getImageUrl(size, imageId) {
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

function parse(e) {
    const data = { igdbId: e.id };
    data.title = e.name || '';
    data.summary = e.summary || '';
    data.releaseDate = (e.first_release_date) ? convertDateToString(new Date(e.first_release_date * 1000)) : '';
    data.platforms = (e.platforms) ? e.platforms.map(p => p.abbreviation ? p.abbreviation : p.name) : [];
    data.genres = (e.genres) ? e.genres.map(g => g.name) : [];
    data.themes = (e.themes) ? e.themes.map(t => t.name) : [];
    if (e.popularity) data.popularity = e.popularity;

    data.image = {};
    if (e.cover && e.cover.image_id)
        [
            { label: 'portrait', size: '720p' },
            { label: 'uniform', size: 'cover_uniform' },
            { label: 'thumb', size: 'thumb' }
        ].forEach(i => data.image[i.label] = getImageUrl(i.size, e.cover.image_id));

    return data;
}

function apiCall(endpoint, body) {
    const url = `${baseUrl}${endpoint}`;
    return axios.post(url, body, { headers })
        .then(response => response.data.map(e => parse(e)));
}

function getItem(igdbIds) {
    const body = `
        fields cover.image_id,summary,genres.name,themes.name;
        where id = (${igdbIds});
    `;
    return apiCall('/games', body);
}

function search(title) {
    const body = `
        fields name, popularity, cover.image_id, platforms.abbreviation, platforms.name;
        search "${title}";
        limit 10;
    `;
    return apiCall('/games', body)
        .then(data => data.sort((a, b) => b.popularity - a.popularity));
}

function getAnticipated(limit = 10) {
    // get unix timestamp in seconds
    const today = Math.floor(Date.now() / 1000);
    const body = `
        fields first_release_date, name, summary, cover.image_id, genres.name, themes.name, platforms.abbreviation, platforms.name;
        limit ${limit};
        where first_release_date > ${today} & release_dates.category = 0;
        sort popularity desc;
    `;
    return apiCall('/games', body);
}

function getHighlyRated(limit = 10) {
    // get unix timestamp in seconds
    const today = Math.floor(Date.now() / 1000);
    const oneYearAgo = today - 31536000;
    const body = `
        fields first_release_date, name, summary, cover.image_id, genres.name, themes.name, platforms.abbreviation, platforms.name;
        limit ${limit};
        where first_release_date > ${oneYearAgo} & first_release_date < ${today} & aggregated_rating_count > 10;
        sort aggregated_rating desc;
    `;
    return apiCall('/games', body);
}

/**
 * Gets popular games  
 * @param {number} limit the number of results to retrieve
 */
function getPopular(limit = 10) {
    // get unix timestamp in seconds
    const today = Math.floor(Date.now() / 1000);
    const oneMonthAgo = today - 2592000;
    // Condition checks for popular games released in North America or WorldWide within the past month
    // However, games released in another region first and then released in NA/World in this month, will not appear
    const body = `
        fields first_release_date, name, summary, cover.image_id, genres.name, themes.name, platforms.abbreviation, platforms.name;
        limit ${limit};
        where first_release_date > ${oneMonthAgo} & first_release_date < ${today} & 
        release_dates.date > ${oneMonthAgo} & release_dates.date < ${today} & release_dates.region = (2,8);
        sort popularity desc;
    `;
    return apiCall('/games', body);
}

function getRecentlyReleased(limit = 10) {
    // get unix timestamp in seconds
    const today = Math.floor(Date.now() / 1000);
    const oneWeekAgo = today - 604800;
    const body = `
        fields first_release_date, name, summary, cover.image_id, genres.name, themes.name, platforms.abbreviation, platforms.name;
        limit ${limit};
        where first_release_date > ${oneWeekAgo} & first_release_date < ${today};
        sort popularity desc;
    `;
    return apiCall('/games', body);
}

module.exports = { getItem, search, getAnticipated, getHighlyRated, getPopular, getRecentlyReleased };
