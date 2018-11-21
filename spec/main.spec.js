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
      .then(({ body }) => {
        expect(body).to.be.an('array');
        expect(body[0]).to.have.all.keys('slug', 'description');
        expect(body.length).to.equal(2);
      }));
    it('GET responds with  a 404 when path is not definined properly', () => request.get('/api/top')
      .expect(404)
      .then((req) => {
        expect(req.body.message).to.eql('path does not exist');
      }));


    it('POST responds with 201 and shows the item posted with created id', () => {
      const testObject = {
        slug: 'mit',
        description: 'The man',
      };
      return request
        .post('/api/topics')
        .send(testObject).expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql(testObject);
          expect(res.body).to.not.equal(testObject);
          expect(res.body);
        });
    });
    it('POST responds with 404 when path is not defined', () => {
      const testObject = {
        slug: 'mit',
        description: 'The man',
      };
      return request
        .post('/api/top')
        .send(testObject).expect(404)
        .then((res) => {
          expect(res.body.message).to.eql('path does not exist');
        });
    });
  });

  describe('/topic/topic:/articles', () => {
    it('GET should return 200 with an array of articles for a specific topic', () => request.get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'created_at', 'topic', 'count');
      }));
    it('GET should return 200 with an array of articles for a specific topic', () => request.get('/api/topics/1/articles')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal('invalid data type');
      }));
  });
});
