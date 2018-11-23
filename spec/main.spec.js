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

  it('responds with a 404 when path does not exist', () => request.get('/api/top')
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

    it('POST responds with 422 when duplicate slug entered', () => {
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

    it('POST responds with a 400 when invalid data type is entered', () => {
      const testObject = {
        slug: null,
        description: null,
      };
      return request
        .post('/api/topics')
        .send(testObject).expect(400)
        .then((res) => {
          expect(res.body.message).to.eql('violates not null input');
        });
    });

    it('Should return "method not allowed" messages for all request types not used for this path', () => {
      const invalidMethods = ['delete', 'put', 'patch'];
      return Promise.all(invalidMethods.map(method => request[method]('/api/topics').expect(405)));
    });
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

      return request
        .post('/api/topics/mitch/articles')
        .send(testObject).expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.eql("They're not exactly dogs, are they?");
        });
    });
    it('POST should return 400 when null data is inserted into body', () => {
      const testObject = {
        title: "They're not exactly dogs, are they?",
        user_id: 2,
        body: null,
      };

      return request
        .post('/api/topics/mit/articles')
        .send(testObject).expect(400)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.eql('violates not null input');
        });
    });
    it('POST should return 400 when invalid data is inserted into body', () => {
      const testObject = {
        title: "They're not exactly dogs, are they?",
        user_id: 'ff',
        body: 'jkjkk',
      };

      return request
        .post('/api/topics/mit/articles')
        .send(testObject).expect(400)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.eql('invalid input syntax for integer');
        });
    });

    it('Should return "method not allowed" messages for all request types not used for this path', () => {
      const invalidMethods = ['delete', 'put', 'patch'];
      return Promise.all(invalidMethods.map(method => request[method]('/api/topics/mitch/articles').expect(405)));
    });
  });


  describe('/articles', () => {
    it('GET should return 200 with an array of articles for a specific topic', () => request.get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'created_at', 'topic', 'comments_count');
        expect(body.articles.length).to.equal(10);
      }));
    it('Should return "method not allowed" messages for all request types not used for this path', () => {
      const invalidMethods = ['delete', 'put', 'patch'];
      return Promise.all(invalidMethods.map(method => request[method]('/api/articles').expect(405)));
    });
  });


  describe('/articles/:article_id', () => {
    it('GET should return a 404 if parametric endpoint is of correct datatype but does not exist', () => request.get('/api/articles/1000')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('path does not exist');
      }));
    it('GET should return 200 with a single articles object with same id as the one specified', () => request.get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.all.keys('article_id', 'author', 'comments_count', 'created_at', 'title', 'topic', 'votes');
      }));
    it('GET should return 400 bad request when id datatype is invalid', () => request.get('/api/articles/ff')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal('invalid data type');
      }));

    it('PATCH should return 200 and increase votes if indicated to by object', () => {
      const testObject = { inc_votes: 1 };

      return request
        .patch('/api/articles/1')
        .send(testObject).expect(200)
        .then((res) => {
          console.log(res.body);
          expect(res.body.votes).to.eql(1);
        });
    });
    it('PATCH should return 200 and increase votes if indicated to by object', () => {
      const testObject = { inc_votes: 'ff' };

      return request
        .patch('/api/articles/1')
        .send(testObject).expect(400)
        .then((res) => {
          console.log(res.body);
          expect(res.body.message).to.eql('invalid data type');
        });
    });


    it('Should return "method not allowed" messages for all request types not used for this path', () => {
      const invalidMethods = ['put'];
      return Promise.all(invalidMethods.map(method => request[method]('/api/articles/1').expect(405)));
    });
  });
});
