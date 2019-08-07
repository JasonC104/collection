const Api = require('../api/tmdb');
const Movie = require('../db/models/movie');
const convertDateToString = require('../utils').convertDateToString;

function parseDatabaseItem(e) {
    const image = {};
    [
        { label: 'portrait', size: 'w500' },
        { label: 'uniform', size: 'w185' },
        { label: 'thumb', size: 'w92' } // TODO maybe try out w58_and_h87_face 
    ].forEach(i => image[i.label] = Api.getImageUrl(i.size, e.imageId));

    return {
        id: e._id,
        title: e.title,
        summary: e.summary,
        watchedOnDate: convertDateToString(e.watchedOnDate),
        rating: e.rating,
        genres: e.genres,
        links: e.links,
        apiId: e.apiId,
        image
    };
}

/////////////// Exported Functions ///////////////

function getCollection(req, res) {
    const query = req.query;
    const requirements = {};
    /* 
        // search
        if (query.search && typeof query.search === 'string') {
            requirements.title = new RegExp(query.search, 'i');
        }
    
        // filter
        if (query.platform && Array.isArray(query.platform)) {
            requirements.platform = { $in: query.platform };
        }
    
        // sort
        const order = (query.order === 'desc') ? -1 : 1;
        const sortRequirements = (query.sort && typeof query.sort === 'string')
            ? { [query.sort]: order } : { purchaseDate: -1 }; */

    Movie.find(requirements)
        //.sort(sortRequirements)
        .exec((err, data) => {
            if (err) { console.log(err); return res.json({ error: err }) };

            const parsedData = data.map(e => parseDatabaseItem(e));
            return res.json(parsedData);
        });
}

function addToCollection(req, res) {
    const body = req.body;
    if (!body.apiId) return res.status(400).json('id must be given');

    Api.getItem(body.apiId)
        .then(item => {
            const movie = new Movie({
                title: item.title,
                summary: item.summary,
                genres: item.genres,
                apiId: item.apiId,
                imageId: item.imageId,
                watchedOnDate: body.watchedOnDate,
                rating: body.rating,
                links: body.links,
            });

            movie.save((err, doc) => {
                if (err) { console.log(err); return res.status(500).json('An error occurred'); }

                console.log(doc);
                return res.json({ success: true });
            });
        })
        .catch(err => { console.log(err); return res.status(500).json('An error occurred'); });
}

function updateItemInCollection(req, res) {
    const body = req.body;
    if (!body.id) return res.status(400).json('id must be given');

    const update = {};
    if (body.rating !== undefined && typeof body.rating === 'number') update.rating = body.rating;

    if (Object.keys(update).length > 0) {
        Movie.findOneAndUpdate({ _id: body.id }, update, err => {
            if (err) return res.send(err);
            console.log(`updated ${body.id}`);
            console.log(update);
            return res.json({ success: true });
        });
    } else {
        return res.send('No update');
    }
}

function deleteFromCollection(req, res) {
    const id = req.params.id;
    if (!id) return res.status(400).json('id must be given');

    Movie.findOneAndDelete({ _id: id }, (err, data) => {
        if (err) { console.log(err); return res.send(err) };

        console.log(`deleted ${id}`);
        console.log(data);
        return res.json({ success: true });
    });
}

function search(req, res) {
    Api.search(req.params.title)
        .then(data => res.json(data))
        .catch(err => { console.log(err); res.status(500).json('An error occured') });
}

function getAnticipated(req, res) {
    Api.getAnticipated()
        .then(data => res.json(data))
        .catch(err => { console.log(err); res.status(500).json('An error occured') });
}

function getPopular(req, res) {
    Api.getPopular()
        .then(data => res.json(data))
        .catch(err => { console.log(err); res.status(500).json('An error occured') });
}

function getRecentlyReleased(req, res) {
    Api.getRecentlyReleased()
        .then(data => res.json(data))
        .catch(err => { console.log(err); res.status(500).json('An error occured') });
}

module.exports = {
    getCollection, addToCollection, updateItemInCollection, deleteFromCollection,
    search, getAnticipated, getPopular, getRecentlyReleased
};
