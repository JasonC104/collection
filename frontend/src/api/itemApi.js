import axios from 'axios';

const baseUrl = 'http://localhost:3001/api';

function get(url, callback) {
    return axios.get(url)
        .then(response => callback(response.data))
        .catch(err => console.log(err));
}

export function getItems(requirements, callback) {
    return axios.get('http://localhost:3001/api/items', { params: requirements })
        .then(response => callback(response.data))
        .catch(err => console.log(err));
};

export function createItem(newItem, callback) {
    return axios.post('http://localhost:3001/api/items', newItem)
        .then(() => callback())
        .catch(err => console.log(err));
}

export function deleteItem(id, callback) {
    return axios.delete('http://localhost:3001/api/items', { data: { id } })
        .then(() => callback())
        .catch(err => console.log(err));
}

export function searchItem(title, callback) {
    return get(`${baseUrl}/search/${title}`, callback); 
}

export function anticipatedGames(callback) {
    return get(`${baseUrl}/anticipated-games`, callback); 
}

export function highlyRated(callback) {
    return get(`${baseUrl}/highly-rated-games`, callback); 
}

export function recentlyReleased(callback) {
    return get(`${baseUrl}/recently-released-games`, callback); 
}
