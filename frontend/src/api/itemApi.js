import axios from 'axios';

export function getItems(requirements, callback) {
    axios.get('http://localhost:3001/api/items', { params: requirements })
        .then(response => callback(response.data))
        .catch(err => console.log(err));
};

export function createItem(newItem, callback) {
    axios.post('http://localhost:3001/api/items', newItem)
        .then(() => callback())
        .catch(err => console.log(err));
}

export function deleteItem(id, callback) {
    axios.delete('http://localhost:3001/api/items', { data: { id } })
        .then(() => callback())
        .catch(err => console.log(err));
}

export function searchItem(title, callback) {
    axios.get(`http://localhost:3001/api/search/${title}`)
        .then(response => callback(response.data))
        .catch(err => console.log(err));
}

export function anticipatedGames(callback) {
    axios.get(`http://localhost:3001/api/anticipated-games`)
        .then(response => callback(response.data))
        .catch(err => console.log(err));
}
