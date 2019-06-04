require('dotenv').config();
const mongoose = require('mongoose');
const csv = require('csvtojson')
const IgdbApi = require('../src/igdb');
const models = require('../src/data');

/* Given a csv file, this script will insert the data into the db */

/////////////// CONSTANTS ///////////////

const dbRoute = process.env.DB_ROUTE_DEV;
const csvFileName = './scripts/full-data.csv';

/////////////////////////////////////////

/* Helper function to find the game's igdb id and cover image */
function searchGame(title) {
    return new Promise((resolve, reject) => {
        IgdbApi.searchGame(title).then(response => {
            const game = response.data.sort((a, b) => b.popularity - a.popularity)[0];
            if (game) {
                if (game.cover && game.cover.image_id) {
                    return resolve({
                        name: game.name,
                        igdb: { id: game.id, imageHash: game.cover.image_id }
                    });
                }
                console.log(`Bad Cover Image for ${game.id}`);
                return reject();
            }
            console.log(`No game found for ${title}`);
            return reject();
        }).catch(err => {
            console.log(err);
            reject();
        });
    });
}

mongoose.connect(dbRoute, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('connected to the database');

    csv({
        delimiter: "|",
        noheader: false,
        headers: ['title', 'platform', 'cost', 'purchaseDate', 'type', 'completed', 'gift'],
        trim: true,
    })
        .fromFile(csvFileName)
        .subscribe((jsonObj) => {
            jsonObj.cost = Number(jsonObj.cost);
            jsonObj.completed = Number(jsonObj.completed);
            jsonObj.gift = Number(jsonObj.gift);
            return new Promise((resolve, reject) => {
                searchGame(jsonObj.title).then(result => {
                    jsonObj.title = result.name;
                    jsonObj.igdb = result.igdb;
                    return resolve();
                }).catch(() => reject());
            })
        })
        .then(data => {
            //console.log(data);
            models.Game.insertMany(data, { ordered: true }, (err, docs) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Inserted ${docs.length} items.`)
                }
                process.exit();
            });
        }).catch(() => process.exit());
});

