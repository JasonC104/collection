const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const models = require('./db/models/game');
const IgdbApi = require('./api/igdb');
const csvParser = require('./csv-parser');
const GamesController = require('./controllers/gamesController');
const Utils = require('./utils');

const app = express();
app.use(cors());
const router = express.Router();

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/games', GamesController.getGamesCollection);
router.post('/games', GamesController.addGameToCollection);
router.put("/games", GamesController.updateGameInCollection);
router.delete('/games', GamesController.deleteGameFromCollection);

router.get('/games/search/:title', GamesController.searchGames);

router.get('/games/anticipated', GamesController.getAnticipatedGames);
router.get('/games/highly-rated', GamesController.getHighlyRatedGames);
router.get('/games/recently-released', GamesController.getRecentlyReleasedGames);

router.get('/games/csv', GamesController.exportGamesToCsv);

// append /api for our http requests
app.use('/api', router);

module.exports = app;
