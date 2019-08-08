import axios from 'axios';

export default class ItemApi {

    constructor(endpoint) {
        this.baseUrl = `http://localhost:3001/api${endpoint}`;
    }

    /**
     * Performs a GET request at the url
     * @param {String} url 
     * @param {Object} params 
     * @param {*} callback 
     */
    get(url, params, callback) {
        return axios.get(url, { params })
            .then(response => callback(response.data))
            .catch(err => console.log(err));
    }

    getItems(requirements, callback) {
        return this.get(`${this.baseUrl}`, requirements, callback);
    };

    createItem(newItem, callback) {
        return axios.post(`${this.baseUrl}`, newItem)
            .then(() => callback())
            .catch(err => console.log(err));
    }

    updateItem(update, callback) {
        return axios.put(`${this.baseUrl}`, update)
            .then(() => callback())
            .catch(err => console.log(err));
    }

    deleteItem(id, callback) {
        return axios.delete(`${this.baseUrl}/${id}`)
            .then(() => callback())
            .catch(err => console.log(err));
    }

    searchItem(title, callback) {
        return this.get(`${this.baseUrl}/search/${title}`, {}, callback);
    }

    anticipatedGames(callback) {
        return this.get(`${this.baseUrl}/anticipated`, {}, callback);
    }

    popular(callback) {
        return this.get(`${this.baseUrl}/popular`, {}, callback);
    }

    recentlyReleased(callback) {
        return this.get(`${this.baseUrl}/recently-released`, {}, callback);
    }

}
