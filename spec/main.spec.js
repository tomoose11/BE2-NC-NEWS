process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const knex = require('../db/connection');

const request = supertest(app);

describe('/api', () => {
  beforeEach(() => knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run()));

  after(() => knex.destroy());
  describe('/topics', () => {
    it('GET responds with a 200 and an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then((req) => {
        expect(req.body).to.be.an('array');
        expect(req.body[0]).to.have.all.keys('slug', 'description');
        expect(req.body.length).to.equal(2);
      }));

    it('GET responds with  a 404 when path is not definined properly', () => request.get('/api/top')
      .expect(404)
      .then((req) => {
        expect(req.body.message).to.eql('path does not exist');
      }));
    it('POST responds with 201 and shows the item posted with created id', () => {
      const testObject = {
        slug: 'mit',
        dscription: 'The man',
      };
      return request
        .post('/api/topics')
        .send(testObject).expect(201)
        .then((res) => {
          expect(res.body).to.eql(testObject);
        });
    });
  });
});
