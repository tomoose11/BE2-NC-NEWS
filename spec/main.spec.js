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
    it('GET QUERY LIMIT: should apply the limit specified in the query', () => request.get('/api/topics/mitch/articles?limit=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.eql(2);
      }));
    it('GET QUERY SORT_BY: should apply sort_by to the specifed query', () => request.get('/api/topics/mitch/articles?sort_by=article_id')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.eql(9);
      }));
    it('GET QUERY P: should sort by page number', () => request.get('/api/topics/mitch/articles?p=1&limit=1')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.eql(9);
      }));
    it('GET QUERY SORT_ASCENDING: should sort by page number', () => request.get('/api/topics/mitch/articles?sort_ascending=true')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.eql(3);
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
    it('GET QUERY LIMIT: should apply the limit specified in the query', () => request.get('/api/articles?limit=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.eql(2);
      }));
    it('GET QUERY SORT_BY: should apply sort_by to the specifed query', () => request.get('/api/articles?sort_by=author')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].author).to.eql('rogersop');
      }));
    it('GET QUERY P: should sort by page number', () => request.get('/api/articles?limit=50')
      .expect(200)
      .then(({ body }) => {
        console.log(body.articles);
        expect(body.articles[0].article_id).to.eql(9);
      }));
    it('GET QUERY SORT_ASCENDING: should sort by page number', () => request.get('/api/topics/mitch/articles?sort_ascending=true')
      .expect(200)
      .then(({ body }) => {
        console.log(body.articles);
        expect(body.articles[0].article_id).to.eql(3);
      }));
    it('Should return "method not allowed" messages for all request types not used for this path', () => {
      const invalidMethods = ['delete', 'put', 'patch'];
      return Promise.all(invalidMethods.map(method => request[method]('/api/articles').expect(405)));
    });
  });


  describe('/articles/:article_id', () => {
    it('should return a 404 if parametric endpoint is of correct datatype but does not exist', () => request.get('/api/articles/1000')
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
          expect(res.body.votes).to.eql(1);
        });
    });
    it('PATCH should return 400 and invalid data type message if data invalid', () => {
      const testObject = { inc_votes: 'ff' };

      return request
        .patch('/api/articles/1')
        .send(testObject).expect(400)
        .then((res) => {
          expect(res.body.message).to.eql('invalid data type');
        });
    });

    it('DELETE should return 200, delete chosen article and any foreign keys referencing the article', () => {
      const testObject = { inc_votes: 1 };

      return request
        .delete('/api/articles/1')
        .send(testObject).expect(204)
        .then((res) => {
          expect(res.body).to.eql({});
        });
    });
    it('DELETE should return 400 invalid data type if paremetric contains invalid data', () => {
      const testObject = { inc_votes: 1 };

      return request
        .delete('/api/articles/ff')
        .send(testObject).expect(400)
        .then((res) => {
          expect(res.body.message).to.eql('invalid data type');
        });
    });

    it('Should return "method not allowed" messages for all request types not used for this path', () => {
      const invalidMethods = ['put'];
      return Promise.all(invalidMethods.map(method => request[method]('/api/articles/1').expect(405)));
    });
  });


  describe('articles/:article_id/comments', () => {
    it('GET should return a 200 and an array of comments of the chosen article', () => request.get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');
        expect(body.comments.length).to.equal(10);
      }));
    it('GET should return a 400 and bad request if parametric endpoint if of the wrong datatype', () => request.get('/api/articles/ff/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal('invalid data type');
      }));
    it('GET should return a 404 if parametric endpoint is of correct datatype but does not exist', () => request.get('/api/articles/1000/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('path does not exist');
      }));

    it('POST should return 201 and the body of the posted object', () => {
      const testObject = {
        user_id: 1,
        body: 'stuff',
      };

      return request
        .post('/api/articles/1/comments')
        .send(testObject).expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.body).to.eql('stuff');
        });
    });
    it('POST should return 404 and message saying path does not exist', () => {
      const testObject = {
        user_id: 1,
        body: 'stuff',
      };

      return request
        .post('/api/articles/1000/comments')
        .send(testObject).expect(404)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.eql('path does not exist');
        });
    });
    it('POST should return 400 when null data is inserted into body', () => {
      const testObject = {
        user_id: null,
        body: 'stuff',
      };

      return request
        .post('/api/articles/1/comments')
        .send(testObject).expect(400)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.eql('violates not null input');
        });
    });
    it('POST should return 400 when invalid data is inserted into body', () => {
      const testObject = {
        user_id: 'hh',
        body: 'stuff',
      };

      return request
        .post('/api/articles/1/comments')
        .send(testObject).expect(400)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.eql('invalid input syntax for integer');
        });
    });

    it('Should return "method not allowed" messages for all request types not used for this path', () => {
      const invalidMethods = ['delete', 'put', 'patch'];
      return Promise.all(invalidMethods.map(method => request[method]('/api/articles').expect(405)));
    });
  });
});
