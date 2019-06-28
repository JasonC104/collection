require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const models = require('./data');
const IgdbApi = require('./igdb');
const csvParser = require('./csv-parser');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

function connectToDatabase(dbRoute) {
	mongoose.connect(dbRoute, { useNewUrlParser: true });
	const db = mongoose.connection;
	db.once('open', () => console.log('connected to the database'));
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

// connects to the database
if (process.env.NODE_ENV.trim() == 'production') {
	connectToDatabase(process.env.DB_ROUTE_PROD);
} else {
	connectToDatabase(process.env.DB_ROUTE_DEV);
}

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function convertDateToString(date) {
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

function generateItemViewModel(e) {
	const purchaseDate = convertDateToString(e.purchaseDate);
	return {
		id: e._id,
		title: e.title,
		platform: e.platform,
		cost: e.cost,
		purchaseDate,
		type: e.type,
		rating: e.rating,
		completed: e.completed,
		gift: e.gift,
		links: e.links,
		igdbId: e.igdb.id,
		imageUrl: `https://images.igdb.com/igdb/image/upload/t_cover_uniform/${e.igdb.imageHash}.jpg`
	};
}

// this is our get method
// this method fetches all available data in our database
router.get('/items', async (req, res) => {
	const query = req.query;
	const requirements = {};
	let sortRequirements = { purchaseDate: -1 };

	// search
	if (query.search) {
		requirements.title = new RegExp(query.search, 'i');
	}

	// filter
	if (query.platform && Array.isArray(query.platform)) {
		let platforms = [];
		await models.Game.distinct('platform', (err, data) => {
			if (err) return res.json({ error: err });
			platforms = data;
		});
		// if query.platform is a valid list of platforms
		const hasInvalidPlatform = query.platform.some(p => platforms.indexOf(p) === -1);
		if (!hasInvalidPlatform) {
			requirements.platform = { $in: query.platform };
		}
	}

	// sort
	if (query.sort) {
		const order = (query.order === 'desc') ? -1 : 1;
		switch (query.sort) {
			case 'date':
				sortRequirements = { purchaseDate: order };
				break;
			case 'title':
				sortRequirements = { title: order };
				break;
			case 'rating':
				sortRequirements = { rating: order };
				break;
		}
	}

	models.Game.find(requirements)
		.sort(sortRequirements)
		.exec((err, data) => {
			if (err) return res.json({ error: err });

			const result = data.map(e => generateItemViewModel(e));
			return res.json({ data: result });
		});
});

function parseIgdbGame(e) {
	const data = { igdbId: e.id };
	data.title = e.name || '';
	data.summary = e.summary || '';
	data.imageUrl = (e.cover && e.cover.url) ? e.cover.url : '';
	data.releaseDate = (e.first_release_date) ? convertDateToString(new Date(e.first_release_date * 1000)) : '';
	data.platforms = (e.platforms) ? e.platforms.map(p => p.abbreviation ? p.abbreviation : p.name) : [];
	data.genres = (e.genres) ? e.genres.map(g => g.name) : [];
	data.themes = (e.themes) ? e.themes.map(t => t.name) : [];
	return data;
}

router.get('/search/:title', (req, res) => {
	IgdbApi.searchGame(req.params.title).then(response => {
		const data = [];
		response.data.sort((a, b) => b.popularity - a.popularity).forEach(e => {
			const d = parseIgdbGame(e);
			if (d.imageUrl && d.platforms) {
				data.push({
					igdbId: d.igdbId,
					imageUrl: d.imageUrl,
					title: d.title,
					platforms: d.platforms,
				});
			}
		});
		return res.json(data);
	}).catch(err => {
		console.log(err);
		return res.json(err);
	});
});

router.get('/anticipated-games', (req, res) => {
	IgdbApi.anticipatedGames().then(response => {
		const data = [];
		response.data.forEach(e => {
			const d = parseIgdbGame(e);
			if (d.imageUrl) {
				data.push({
					igdbId: d.igdbId,
					imageUrl: d.imageUrl,
					title: d.title,
					platforms: d.platforms,
					summary: d.summary,
					releaseDate: d.releaseDate,
					genres: d.genres,
					themes: d.themes
				});
			}
		});
		return res.json(data);
	}).catch(err => {
		console.log(err);
		return res.json(err);
	});
});

router.get('/highly-rated-games', (req, res) => {
	IgdbApi.highlyRated().then(response => {
		const data = [];
		response.data.forEach(e => {
			const d = parseIgdbGame(e);
			if (d.imageUrl) {
				data.push({
					igdbId: d.igdbId,
					imageUrl: d.imageUrl,
					title: d.title,
					platforms: d.platforms,
					summary: d.summary,
					releaseDate: d.releaseDate,
					genres: d.genres,
					themes: d.themes
				});
			}
		});
		return res.json(data);
	}).catch(err => {
		console.log(err);
		return res.json(err);
	});
});

router.get('/items/csv', (req, res) => {
	models.Game.find().sort({ purchaseDate: 1 }).exec((err, data) => {
		if (err) return res.json({ error: err });

		const csv = csvParser.itemDataToCsv(data);
		res.attachment('item-data.csv');
		return res.status(200).type('text/csv').send(csv);
	});
});

// this is our update method
// this method overwrites existing data in our database
// router.post("/updateData", (req, res) => {
// 	const {
// 		id,
// 		update
// 	} = req.body;
// 	models.Game.findOneAndUpdate(id, update, err => {
// 		if (err) return res.json({
// 			success: false,
// 			error: err
// 		});
// 		return res.json({
// 			success: true
// 		});
// 	});
// });

// this is our delete method
// this method removes existing data in our database
router.delete('/items', (req, res) => {
	models.Game.findOneAndDelete({ _id: req.body.id }, err => {
		if (err) return res.send(err);
		console.log(`deleted ${req.body.id}`);
		return res.json({ success: true });
	});
});

// this is our create method
// this method adds new data in our database
router.post('/items', async (req, res) => {
	const item = req.body;
	let imageHash;
	await IgdbApi.getGameCover(item.igdbId).then(response => {
		imageHash = response.data[0].cover.image_id
	}).catch(err => {
		console.log(err);
		return res.json(err);
	});

	const game = new models.Game({
		title: item.title,
		platform: item.platform,
		cost: item.cost,
		purchaseDate: item.purchaseDate,
		type: item.type,
		completed: item.completed,
		gift: item.gift,
		rating: item.rating,
		links: item.links,
		igdb: {
			id: item.igdbId,
			imageHash
		}
	});

	game.save((err, doc) => {
		if (err) {
			console.log(err);
			return res.json({ error: err });
		}
		console.log(doc);
		return res.json({ success: true });
	});
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
