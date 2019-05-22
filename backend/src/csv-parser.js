const json2csv = require('json2csv');

function itemDataToCsv(itemData) {
    // example nested fields usage https://www.npmjs.com/package/json2csv#example-4
    const fields = [
        { label: 'Title', value: 'title' },
        { label: 'Platform', value: 'platform' },
        { label: 'Cost', value: 'cost' },
        { label: 'Rating', value: 'rating' },
        { label: 'IGDB Id', value: 'igdbId' }
    ];
    return json2csv.parse(itemData, { fields });
}

module.exports = { itemDataToCsv };
