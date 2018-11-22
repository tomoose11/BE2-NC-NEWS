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

  it('GET responds with  a 404 when path does not exist', () => request.get('/api/top')
    .expect(404)
    .then((req) => {
      expect(req.body.message).to.eql('path does not exist');
    }));

  describe('/topics', () => {
    it('GET responds with a 200 and an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.have.all.keys('slug', 'description');
        expect(body.topics.length).to.equal(2);
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
    it('POST responds with 422 when duplicat slug entered', () => {
      const testObject = {
        slug: 'mitch',
        description: 'The man',
      };
      return request
        .post('/api/topics')
        .send(testObject).expect(422)
        .then((res) => {
          expect(res.body.message).to.eql('Key (slug)=(mitch) already exists.');
        });
    });

    it('DELETE responds with 405 when method is not allowed', () => request.delete('/api/topics')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('method not allowed');
      }));
  });


  describe('/topic/topic:/articles', () => {
    it('GET should return 200 with an array of articles for a specific topic', () => request.get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'created_at', 'topic', 'comments_count');
      }));
    it('GET should return a 400 if an invalid data type id used as a parameter', () => request.get('/api/topics/1/articles')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal('invalid data type');
      }));

    it('POST responds with 201 and shows the item posted with created id', () => {
      const testObject = {
        title: "They're not exactly dogs, are they?",
        user_id: 2,
        body: 'Well? Think about it.',
      };
      const expectedOb = {
        article_id: 13,
        title: "They're not exactly dogs, are they?",
        body: 'Well? Think about it.',
        votes: 0,
        topic: 'mitch',
        user_id: 2,
        created_at: '2018-11-22T14:31:46.814Z',
      };
      return request
        .post('/api/topics/mitch/articles')
        .send(testObject).expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.eql("They're not exactly dogs, are they?");
        });
    });

    it('DELETE should return a 405 method not allowed', () => request.delete('/api/topics/mitch/articles')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.eql('method not allowed');
      }));
  });


  describe('/articles', () => {
    it('GET should return 200 with an array of articles for a specific topic', () => request.get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'created_at', 'topic', 'comments_count');
        expect(body.articles.length).to.equal(10);
      }));
    it('DELETE should return a 405 method not allowed', () => request.delete('/api/topics/mitch/articles')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.eql('method not allowed');
      }));
  });
});
