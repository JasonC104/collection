import axios from 'axios';

const url = 'http://localhost:3001/api/widgets';

class WidgetsApi {

    getWidgetsData(widgetsInfo) {
        return axios.post(url, widgetsInfo)
            .then(response => response.data)
            .catch(err => console.log(err));
    }
}

export default new WidgetsApi();
