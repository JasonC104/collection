import axios from 'axios';

export function getItems(callback) {
    axios.get('http://localhost:3001/api/items')
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
    axios.get(`http://localhost:3001/api/items/search/${title}`)
        .then(response => callback(response.data))
        .catch(err => console.log(err));
}
