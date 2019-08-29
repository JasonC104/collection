import axios from 'axios';

export default class ItemApi {

    constructor(endpoint) {
        this.baseUrl = `http://localhost:3001/api${endpoint}`;
    }

    /**
     * Performs a GET request at the url
     * @param {String} url 
     * @param {Object} params 
     */
    get(url, params) {
        return axios.get(url, { params })
            .then(response => response.data)
            .catch(err => console.log(err));
    }

    getItems(requirements) {
        return this.get(`${this.baseUrl}`, requirements);
    };

    createItem(newItem, callback) {
        return axios.post(`${this.baseUrl}`, newItem)
            .catch(err => console.log(err));
    }

    updateItem(update, callback) {
        return axios.put(`${this.baseUrl}`, update)
            .catch(err => console.log(err));
    }

    deleteItem(id, callback) {
        return axios.delete(`${this.baseUrl}/${id}`)
            .catch(err => console.log(err));
    }

    searchItem(title) {
        return this.get(`${this.baseUrl}/search/${title}`, {});
    }

    anticipatedGames() {
        return this.get(`${this.baseUrl}/anticipated`, {});
    }

    popular() {
        return this.get(`${this.baseUrl}/popular`, {});
    }

    recentlyReleased() {
        return this.get(`${this.baseUrl}/recently-released`, {});
    }

}
