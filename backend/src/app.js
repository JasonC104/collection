require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ItemModel = require('./data');
const IgdbApi = require('./igdb');
const csvParser = require('./csv-parser');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// connects our back end code with the database
mongoose.connect(process.env.DB_ROUTE, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function generateItemViewModel(e) {
	return {
		id: e._id,
		title: e.title,
		platform: e.platform,
		cost: e.cost,
		rating: e.rating,
		imageUrl: `https://images.igdb.com/igdb/image/upload/t_720p/${e.imageHash}.jpg`
	};
}

// this is our get method
// this method fetches all available data in our database
router.get('/items', async (req, res) => {
	const query = req.query;
	const requirements = {};
	let sortRequirements = { createdAt: -1 };

	// search
	if (query.search) {
		requirements.title = new RegExp(query.search, 'i');
	}

	// filter
	if (query.platform && Array.isArray(query.platform)) {
		let platforms = [];
		await ItemModel.distinct('platform', (err, data) => {
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
				sortRequirements = { createdAt: order };
				break;
			case 'title':
				sortRequirements = { title: order };
				break;
			case 'rating':
				sortRequirements = { rating: order };
				break;
		}
	}

	ItemModel.find(requirements)
		.sort(sortRequirements)
		.exec((err, data) => {
			if (err) return res.json({ error: err });

			const result = data.map(e => generateItemViewModel(e));
			return res.json({ data: result });
		});
});

router.get('/search/:title', (req, res) => {
	IgdbApi.searchGame(req.params.title).then(response => {
		const data = [];
		response.data.sort((a, b) => b.popularity - a.popularity).forEach(e => {
			if (e.cover && e.cover.url && e.platforms) {
				const imageUrl = e.cover.url.replace('t_thumb', 't_cover_small');
				const platforms = e.platforms.map(p => {
					return p.abbreviation ? p.abbreviation : p.name;
				});
				data.push({ igdbId: e.id, imageUrl, title: e.name, platforms });
			}
		});
		return res.json(data);
	}).catch(err => {
		console.log(err);
		return res.json(err);
	});
});

router.get('/items/csv', (req, res) => {
	ItemModel.find().sort({ createdAt: 1 }).exec((err, data) => {
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
// 	ItemModel.findOneAndUpdate(id, update, err => {
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
	ItemModel.findOneAndDelete({ _id: req.body.id }, err => {
		if (err) return res.send(err);
		console.log(`deleted ${req.body.id}`);
		return res.json({ success: true });
	});
});

// this is our create method
// this method adds new data in our database
router.post('/items', (req, res) => {
	const item = req.body;
	IgdbApi.getGameCover(item.igdbId).then(response => {
		const data = {
			title: item.title,
			platform: item.platform,
			cost: item.cost,
			rating: item.rating,
			igdbId: item.igdbId,
			imageHash: response.data[0].cover.image_id
		};

		(new ItemModel(data)).save((err, doc) => {
			if (err) {
				console.log(err);
				return res.json({ error: err });
			}
			console.log(doc);
			return res.json({ success: true });
		});

	}).catch(err => {
		console.log(err);
		return res.json(err);
	});
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
