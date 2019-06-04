require('dotenv').config();
const mongoose = require('mongoose');
const models = require('../src/data');

/* This script will update a document in the db based on the updateObject and itemId */

/////////////// CONSTANTS ///////////////

const dbRoute = process.env.DB_ROUTE_DEV;
const itemId = '';
const updateObject = {
};

/////////////////////////////////////////

mongoose.connect(dbRoute, { useNewUrlParser: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('connected to the database');

    models.Game.findByIdAndUpdate(itemId, updateObject, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Updated the item.`);
        }
        process.exit()
    });
});

