const IgdbApi = require('../api/igdb');
const TmdbApi = require('../api/tmdb');
const Game = require('../db/models/game');
const Movie = require('../db/models/movie');
const ChartWidgetCreator = require('../helpers/chartWidgetCreator');

function getWidgetsData(req, res) {
    const schemas = req.body;
    if (!Array.isArray(schemas)) return res.status(400).json('Widget Info should be provided');

    const widgetsData = [];
    schemas.forEach(schema => {
        const widgetData = getWidgetData(schema);
        if (widgetData) {
            widgetsData.push(
                widgetData.then(data => { return { ...schema, ...data } })
            );
        }
    });
    Promise.all(widgetsData).then(values => {
        res.json(values);
    })
}

function getWidgetData(schema) {
    switch (schema['Widget Type']) {
        case 'chart':
            // Get the dataset that we will be using to generate the chart data
            const model = getDatabaseModel(schema['Data Set']);
            return (model) ? ChartWidgetCreator.getChartData(model, schema) : null;
        case 'news':
            return null;
        case 'other':
            const Api = getApi(schema['Data Set']);
            return (Api) ? getItemListData(Api, schema) : null;
        default:
            return null;
    }
}

/**
 * Returns the database model object
 * @param {string} model 
 */
function getDatabaseModel(model) {
    switch (model) {
        case 'games':
            return Game;
        case 'movies':
            return Movie;
        default:
            return null;
    }
}

/**
 * Returns the Api corresponding to the model
 * @param {string} model 
 */
function getApi(model) {
    switch (model) {
        case 'games':
            return IgdbApi;
        case 'movies':
            return TmdbApi;
        default:
            return null;
    }
}

function getItemListData(Api, schema) {
    switch (schema['Widget']) {
        case 'Anticipated':
            return Api.getAnticipated().then(data => { return { data } });
        case 'Popular':
            return Api.getPopular().then(data => { return { data } });
        case 'Recently Released':
            return Api.getRecentlyReleased().then(data => { return { data } });
        default:
            return null;
    }
}

module.exports = { getWidgetsData };
