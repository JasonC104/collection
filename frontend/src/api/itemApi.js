import axios from 'axios';

const baseUrl = 'http://localhost:3001/api';

function get(url, callback) {
    return axios.get(url)
        .then(response => callback(response.data))
        .catch(err => console.log(err));
}

export function getItems(requirements, callback) {
    return axios.get(`${baseUrl}/items`, { params: requirements })
        .then(response => callback(response.data))
        .catch(err => console.log(err));
};

export function createItem(newItem, callback) {
    return axios.post(`${baseUrl}/items`, newItem)
        .then(() => callback())
        .catch(err => console.log(err));
}

export function updateItem(id, update, callback) {
    return axios.put(`${baseUrl}/items`, { data: { id, ...update } })
        .then(() => callback())
        .catch(err => console.log(err));
}

export function deleteItem(id, callback) {
    return axios.delete(`${baseUrl}/items`, { data: { id } })
        .then(() => callback())
        .catch(err => console.log(err));
}

export function searchItem(title, callback) {
    return get(`${baseUrl}/search/${title}`, callback); 
}

export function anticipatedGames(callback) {
    return get(`${baseUrl}/games/anticipated`, callback); 
}

export function highlyRated(callback) {
    return get(`${baseUrl}/games/highly-rated`, callback); 
}

export function recentlyReleased(callback) {
    return get(`${baseUrl}/games/recently-released`, callback); 
}
