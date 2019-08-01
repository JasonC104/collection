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

function connectToMock() {
    return new Promise((resolve, reject) => {
        console.log(0);
        const Mockgoose = require('mockgoose').Mockgoose;
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.prepareStorage()
            .then(() => {
                console.log(1);
                mongoose.connect(process.env.DB_ROUTE_DEV, { useNewUrlParser: true, useFindAndModify: false })
                    .then((res, err) => {
                        console.log(2);
                        if (err) return reject(err);
                        resolve();
                    });
                // connectToDatabase('')
                //     .then(() => resolve())
                //     .catch((err) => reject(err));
            })
            .catch((err) => reject(err));

    });
}

function connect() {
    switch (process.env.NODE_ENV.trim()) {
        case 'production':
            return connectToDatabase(process.env.DB_ROUTE_PROD);
        case 'local':
            return connectToDatabase(process.env.DB_ROUTE_DEV);
        case 'test':
            return connectToMock();
        default:
            throw Error('No NODE_ENV set');
    }
}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };
