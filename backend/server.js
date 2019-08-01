require('dotenv').config();

const app = require('./src/app.js');
const db = require('./src/db');

const PORT = 3001;

db.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log('Listening on port: ' + PORT);
        });
    })
    .catch(err => console.log(err));
