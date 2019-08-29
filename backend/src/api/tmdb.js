const axios = require('axios');
const convertDateToString = require('../utils').convertDateToString;

const baseUrl = process.env.TMDB_API_URL;
const api_key = process.env.TMDB_KEY;

// construct the dictionary for movie genres
let movieGenres = {};
apiCall('/genre/movie/list')
    .then(data => data.genres.forEach(genre => { movieGenres[genre.id] = genre.name }))
    .catch(err => console.log(err));

function getImageUrl(size, imageId) {
    return `http://image.tmdb.org/t/p/${size}${imageId}`;
}

function parse(e) {
    const data = { apiId: e.id };
    data.title = e.title || '';
    data.summary = e.overview || '';
    data.releaseDate = (e.release_date) ? convertDateToString(new Date(`${e.release_date}T00:00:00`)) : '';

    if (e.genres) data.genres = e.genres.map(g => g.name);
    else if (e.genre_ids) data.genres = e.genre_ids.map(g => movieGenres[g]);
    else data.genres = [];

    if (e.popularity) data.popularity = e.popularity;

    data.image = {};
    if (e.poster_path) {
        data.imageId = e.poster_path;
        [
            { label: 'portrait', size: 'w500' },
            { label: 'uniform', size: 'w185' },
            { label: 'thumb', size: 'w92' } // TODO maybe try out w58_and_h87_face 
        ].forEach(i => data.image[i.label] = getImageUrl(i.size, e.poster_path));
    }

    return data;
}

/**
 * Perform the api call to the tmdb with the api key added to the request parameters
 * @param {string} endpoint 
 * @param {*} params 
 * @returns {Promise} Response from the api call
 */
function apiCall(endpoint, params = {}) {
    const url = `${baseUrl}${endpoint}`;
    return axios.get(url, { params: { ...params, api_key } })
        .then(response => response.data);
}

/**
 * Performs the api call to the tmdb and parses the responsed movies
 * @param {string} endpoint 
 * @param {*} params 
 * @returns {Promise} Parsed response from the api call
 */
function parseApiCall(endpoint, params = {}) {
    return apiCall(endpoint, params)
        .then(data => {
            if (data.results)
                return data.results.map(e => parse(e))
            else
                return parse(data);
        });
}

function getItem(id) {
    return parseApiCall(`/movie/${id}`);
}

function search(title, limit = 10) {
    const params = { query: title };
    return parseApiCall('/search/movie', params)
        .then(data => data.slice(0, limit));
}

/**
 * Get popular movies released in the future 
 * @param {number} limit 
 * @returns {Promise}
 */
async function getAnticipated(limit = 10, maxPages = 10) {
    const anticipated = [];
    let page = 1;

    //////// TODO try out the discover endpoint instead

    // stop searching for upcoming movies when we found a number of movies, or have searched a number of pages
    while (anticipated.length <= limit && page < maxPages) {
        const futureMovies = await parseApiCall('/movie/upcoming', { page })
            .then(data => data.filter(e => new Date(e.releaseDate) > new Date()));
        anticipated.push(...futureMovies);
        page++;
    }
    return anticipated.slice(0, limit);
}

function getPopular(limit = 10) {
    return parseApiCall('/trending/movie/week')
        .then(data => data.slice(0, limit));
}

function getRecentlyReleased(limit = 10) {
    return parseApiCall('/movie/now_playing')
        .then(data => data.slice(0, limit));
}

module.exports = {
    getImageUrl, getItem, search, getAnticipated, getPopular, getRecentlyReleased
};
