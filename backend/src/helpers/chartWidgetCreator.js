const getPastMonth = require('../utils').getPastMonth;
const getNextMonth = require('../utils').getNextMonth;
const getMonthName = require('../utils').getMonthName;
const getLastMonths = require('../utils').getLastMonths;

function getChartData(model, schema) {
    switch (schema['Chart Type']) {
        case 'PieWidget':
            return getPieChartData(model, schema);
        case 'BarWidget':
            return getBarChartData(model, schema);
        default:
            return null;
    }
}

function getLabel(attribute, label) {
    if (label === true) {
        return attribute;
    } else if (label === false) {
        return `Not ${attribute}`;
    } else {
        return label;
    }
}

function getPieChartData(model, schema) {
    if (!schema['Attribute']) return null;

    // Group the data by the given attribute and project it to the wanted format
    return new Promise((resolve, reject) => {
        model.aggregate()
            .group({
                _id: `$${schema['Attribute']}`,
                value: { $sum: 1 },
                items: { $push: { id: '$_id' } }
            })
            .project({
                label: '$_id',
                value: '$value',
                items: '$items.id',
                _id: 0
            })
            .exec((err, data) => {
                if (err) { console.log(err); return reject(null); }

                data.map(d => {
                    d.label = getLabel(schema['Attribute'], d.label);
                    return d;
                });
                return resolve({ data });
            });
    });
}

function getBarChartData(model, schema) {
    if (!schema['Attribute'] || !schema['X-Axis']) return null;

    if (schema['Attribute'] === 'cost') {
        // Filter for items within the purchase date duration
        // Group by month and year and accumulate the costs in each month
        // Project the final result
        return new Promise((resolve, reject) => {
            model.aggregate()
                .match({ purchaseDate: { $gte: getPastMonth(schema['Duration'] - 1), $lt: getNextMonth() } })
                .group({
                    _id: { month: { $month: "$purchaseDate" }, year: { $year: "$purchaseDate" } },
                    items: { $push: { id: '$_id' } },
                    cost: { $sum: '$cost' }
                })
                .project({
                    month: '$_id.month',
                    items: '$items.id',
                    cost: '$cost',
                    _id: 0
                })
                .exec((err, data) => {
                    if (err) { console.log(err); return reject(null); }

                    // Get the months in the duration and populate the data for each month
                    data = getMonthDuration(schema['Duration']).map(month => {
                        const entry = { label: getMonthName(month), items: {} };
                        const d = data.find(e => e.month - 1 === month);
                        if (d) {
                            entry['cost'] = d.cost;
                            entry.items['cost'] = d.items;
                        }
                        return entry;
                    });
                    const datakey = ['cost'];
                    return resolve({ data, datakey });
                });
        });

    } else if (schema['Attribute'] === 'platform' || schema['Attribute'] === 'type') {

        return new Promise((resolve, reject) => {
            const attributeExpression = `$${schema['Attribute']}`;

            // Filter for items within the purchase date duration
            // Group by month and year and platform/type
            // Group that result by month and year (this allows the widget to have stacked bars)
            // Sort and Project the final result
            model.aggregate()
                .match({ purchaseDate: { $gte: getPastMonth(schema['Duration'] - 1), $lt: getNextMonth() } })
                .group({
                    _id: {
                        month: { $month: "$purchaseDate" },
                        year: { $year: "$purchaseDate" },
                        attribute: attributeExpression
                    },
                    items: { $push: { id: '$_id' } },
                    value: { $sum: 1 }
                })
                .group({
                    _id: { month: '$_id.month', year: '$_id.year' },
                    values: {
                        $push: {
                            attribute: `$_id.attribute`,
                            items: '$items.id',
                            value: '$value'
                        }
                    }
                })
                .project({
                    month: '$_id.month',
                    values: '$values',
                    _id: 0
                })
                .exec((err, data) => {
                    if (err) { console.log(err); return reject(null); }

                    // Get all the possible attribute values
                    const datakey = new Set();
                    data.forEach(d => { d.values.forEach(v => datakey.add(v.attribute)) });

                    data = getMonthDuration(schema['Duration']).map(month => {
                        const entry = { label: getMonthName(month), items: {} };
                        const d = data.find(e => e.month - 1 === month);
                        if (d) {
                            d.values.forEach(v => {
                                entry[v.attribute] = v.value;
                                entry.items[v.attribute] = v.items;
                            });
                        }
                        return entry;
                    });
                    return resolve({ data, datakey: Array.from(datakey) });
                });
        });

    }

    return null;
}

function getMonthDuration(duration) {
    return getLastMonths(duration).reverse()
}

module.exports = { getChartData };
