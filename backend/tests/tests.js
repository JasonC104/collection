require('dotenv').config();

const chai = require('chai');
// const chaiHttp = require('chai-http');
const assert = chai.assert;
const httpMocks = require('node-mocks-http');
// const nock = require('nock');
const proxyquire = require('proxyquire').noCallThru();
const igdbApiStub = require('./igdbStub');
const gamesController = proxyquire('../src/controllers/gamesController', { '../api/igdb': igdbApiStub });

// const app = require('../src/app');
const db = require('../src/db');

// chai.use(chaiHttp);


describe('Games tests', () => {

    let request, response;

    before((done) => {

        done();

        // db.connect()
        //     .then(() => done())
        //     .catch((err) => done(err));
    })

    beforeEach((done) => {
        request = httpMocks.createRequest();
        response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
        done();
    })

    // after((done) => {
    //     db.close()
    //         .then(() => done())
    //         .catch((err) => done(err));
    // })

    it('get anticipated games', (done) => {

        response.on('end', () => {
            const data = response._getJSONData();
            assert.lengthOf(data, 2);
            assert.equal(data[0].title, "Fire Emblem: Three Houses");
            assert.isNotEmpty(data[0].imageUrl);
            done();
        });

        gamesController.getAnticipatedGames(request, response);




        // chai.request(app)
        //     .get('/api/games/anticipated')
        //     .end((err, res) => {
        //         const data = res.body;
        //         assert.equal(res.status, 200);
        //         assert.lengthOf(data, 2);
        //         assert.equal(data[0].title, "Fire Emblem: Three Houses");
        //         assert.isNotEmpty(data[0].imageUrl);
        //         done();
        //     });
    });
});
