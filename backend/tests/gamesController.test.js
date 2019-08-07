require('dotenv').config();

const expect = require('chai').expect;
const request = require('supertest');
const nock = require('nock')
const { MongoMemoryServer } = require('mongodb-memory-server-core');

const app = require('../src/app');
const apiMock = require('./igdbMock');
const db = require('../src/db');

describe('Games tests', () => {

    let mongoServer;

    before((done) => {
        // disable all network requests, except to localhost
        nock.disableNetConnect();
        nock.enableNetConnect('127.0.0.1');

        // connect to temporary mongo db
        mongoServer = new MongoMemoryServer();
        mongoServer.getConnectionString()
            .then(mongoUri => db.connect(mongoUri))
            .then(() => done())
            .catch(err => done(err));
    });

    afterEach(() => {
        nock.cleanAll();
    })

    after(async () => {
        await db.close();
        await mongoServer.stop();
    });

    it('search', (done) => {
        const endpoint = '/api/games/search/uncharted';
        const scope = nock(process.env.IGDB_API_URL)
            .post('/games')
            .reply(200, apiMock.search());

        request(app).get(endpoint)
            .then(res => {
                const data = res.body;
                expect(data).to.have.length.lengthOf(2);
                data.forEach(element => {
                    expect(element).to.have.property('igdbId').to.be.a('number');
                    expect(element).to.have.property('title').to.be.a('string').that.is.not.empty;
                    expect(element).to.have.property('platforms').to.be.an('array').that.is.not.empty;
                    expect(element).to.have.property('popularity').to.be.a('number');
                    expect(element).to.have.nested.property('image.portrait').to.be.a('string').that.is.not.empty;
                    expect(element).to.have.nested.property('image.uniform').to.be.a('string').that.is.not.empty;
                    expect(element).to.have.nested.property('image.thumb').to.be.a('string').that.is.not.empty;
                });
                expect(data[0].popularity).to.be.greaterThan(data[1].popularity);

                expect(scope.isDone()).to.be.true;
                done();
            }).catch((err) => done(err));
    });

    [
        { function: 'getAnticipated', endpoint: '/api/games/anticipated' },
        { function: 'getHighlyRated', endpoint: '/api/games/highly-rated' },
        { function: 'getRecentlyReleased', endpoint: '/api/games/recently-released' }
    ].forEach(test => {
        it(test.function, (done) => {
            const scope = nock(process.env.IGDB_API_URL)
                .post('/games')
                .reply(200, apiMock[test.function]());

            request(app).get(test.endpoint)
                .then(res => {
                    const data = res.body;
                    expect(data).to.have.length.lengthOf(1);

                    const element = data[0];
                    expect(element).to.have.property('igdbId').to.be.a('number');
                    expect(element).to.have.property('title').to.be.a('string').that.is.not.empty;
                    expect(element).to.have.property('summary').to.be.a('string').that.is.not.empty;
                    expect(element).to.have.property('platforms').to.be.an('array').that.is.not.empty;
                    expect(element).to.have.property('genres').to.be.an('array').that.is.not.empty;
                    expect(element).to.have.property('themes').to.be.an('array').that.is.not.empty;
                    expect(element).to.have.property('releaseDate').to.be.a('string').that.is.not.empty;
                    expect(element).to.have.nested.property('image.portrait').to.be.a('string').that.is.not.empty;
                    expect(element).to.have.nested.property('image.uniform').to.be.a('string').that.is.not.empty;
                    expect(element).to.have.nested.property('image.thumb').to.be.a('string').that.is.not.empty;

                    expect(scope.isDone()).to.be.true;
                    done();
                }).catch((err) => done(err));
        });
    });

    it('CRUD actions', async () => {
        const endpoint = '/api/games';
        const scope = nock(process.env.IGDB_API_URL)
            .post('/games')
            .reply(200, apiMock.getGamesInfo());
        const postData = {
            "title": "Rune Factory 4 Special", "platform": "Switch", "cost": 60, "type": "Physical", "rating": 4, "igdbId": 115278
        };
        let id;

        // Post the data
        await request(app)
            .post(endpoint)
            .send(postData)
            .expect(200);

        // Get the data
        await request(app)
            .get(endpoint)
            .then(res => {
                const data = res.body;
                expect(data).to.have.lengthOf(1);

                const element = data[0];
                id = element.id;
                expect(element).to.have.property('igdbId').to.equal(postData.igdbId);
                expect(element).to.have.property('title').to.equal(postData.title);
                expect(element).to.have.property('platform').to.equal(postData.platform);
                expect(element).to.have.property('cost').to.equal(postData.cost);
                expect(element).to.have.property('type').to.equal(postData.type);
                expect(element).to.have.property('rating').to.equal(postData.rating);
                expect(element).to.have.property('completed').to.equal(false);
                expect(element).to.have.property('gift').to.equal(false);
                expect(element).to.have.property('purchaseDate').to.be.a('string').that.is.not.empty;

                expect(element).to.have.property('summary').to.be.a('string').that.is.not.empty;
                expect(element).to.have.property('genres').to.be.an('array').that.is.not.empty;
                expect(element).to.have.property('themes').to.be.an('array').that.is.not.empty;
                expect(element).to.have.nested.property('image.portrait').to.be.a('string').that.is.not.empty;
                expect(element).to.have.nested.property('image.uniform').to.be.a('string').that.is.not.empty;
                expect(element).to.have.nested.property('image.thumb').to.be.a('string').that.is.not.empty;
            });

        // Update the data
        const update = { id, rating: 5, completed: true };
        await request(app)
            .put(endpoint)
            .send(update)
            .expect(200);

        // Get the data
        await request(app)
            .get(endpoint)
            .then(res => {
                const data = res.body;
                expect(data).to.have.lengthOf(1);

                const element = data[0];
                expect(element).to.have.property('igdbId').to.equal(postData.igdbId);
                expect(element).to.have.property('title').to.equal(postData.title);
                expect(element).to.have.property('platform').to.equal(postData.platform);
                expect(element).to.have.property('cost').to.equal(postData.cost);
                expect(element).to.have.property('type').to.equal(postData.type);
                expect(element).to.have.property('rating').to.equal(update.rating);
                expect(element).to.have.property('completed').to.equal(update.completed);
                expect(element).to.have.property('gift').to.equal(false);
            });

        // Delete the data
        await request(app)
            .delete(`${endpoint}/${id}`)
            .send(update)
            .expect(200);

        // Get the data
        await request(app)
            .get(endpoint)
            .then(res => {
                const data = res.body;
                expect(data).to.be.empty;
                expect(scope.isDone()).to.be.true;
            });
    });
});
