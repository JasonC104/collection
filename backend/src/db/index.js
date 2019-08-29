const mongoose = require('mongoose');

function connectToDatabase(dbRoute) {
    return new Promise((resolve, reject) => {

        mongoose.connect(dbRoute, { useNewUrlParser: true, useFindAndModify: false })
            .then((res, err) => {
                if (err) return reject(err);
                resolve();
            });

    });
}

function connect(dbRoute = '') {
    switch (process.env.NODE_ENV.trim()) {
        case 'production':
            return connectToDatabase(process.env.DB_ROUTE_PROD);
        case 'local':
            return connectToDatabase(process.env.DB_ROUTE_DEV);
        case 'test':
            return connectToDatabase(dbRoute);
        default:
            throw Error('No NODE_ENV set');
    }
}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };
