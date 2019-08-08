const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const GamesController = require('./controllers/gamesController');
const MoviesController = require('./controllers/moviesController');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

/////////////// Games ///////////////

router.get('/games', GamesController.getCollection);
router.post('/games', GamesController.addToCollection);
router.put("/games", GamesController.updateItemInCollection);
router.delete('/games/:id', GamesController.deleteFromCollection);

router.get('/games/search/:title', GamesController.search);

router.get('/games/anticipated', GamesController.getAnticipated);
router.get('/games/popular', GamesController.getPopular);
router.get('/games/recently-released', GamesController.getRecentlyReleased);

router.get('/games/csv', GamesController.exportToCsv);

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
