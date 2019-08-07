const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const GamesController = require('./controllers/gamesController');
const MoviesController = require('./controllers/moviesController');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router);
app.use(cors());

/////////////// Games ///////////////

router.get('/games', GamesController.getGamesCollection);
router.post('/games', GamesController.addGameToCollection);
router.put("/games", GamesController.updateGameInCollection);
router.delete('/games/:id', GamesController.deleteGameFromCollection);

router.get('/games/search/:title', GamesController.searchGames);

router.get('/games/anticipated', GamesController.getAnticipatedGames);
router.get('/games/highly-rated', GamesController.getHighlyRatedGames);
router.get('/games/recently-released', GamesController.getRecentlyReleasedGames);

router.get('/games/csv', GamesController.exportGamesToCsv);

/////////////// Movies ///////////////

router.get('/movies', MoviesController.getCollection);
router.post('/movies', MoviesController.addToCollection);
router.put("/movies", MoviesController.updateItemInCollection);
router.delete('/movies/:id', MoviesController.deleteFromCollection);

router.get('/movies/search/:title', MoviesController.search);

router.get('/movies/anticipated', MoviesController.getAnticipated);
router.get('/movies/popular', MoviesController.getPopular);
router.get('/movies/recently-released', MoviesController.getRecentlyReleased);

module.exports = app;
