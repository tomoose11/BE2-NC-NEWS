# Toms-NC-knews

## News Api

This news api allows you to retrieve news articles. You can search by topic or article id. You can post new topics, new articles and new comments. You can delete articles and comments if you choose to. 

## Getting Started

### Prerequisites

Clone this repository an move into the root folder. use the command 'npm i' to install all the dependencies for this project. All dependencies are listed below:

-express (a server web framework) `npm i express`

-body-parser (middle where which parses the body of your requests) `npm i body-parser`

-knex (a SQL query builder) `npm i knex`

-pg (a PSQL package) `npm i pg`

for development and testing purposes new will need the following:

-nodemon (to restart server automatically after making changes) `npm i nodemon`

-eslint (for linting) `npm i eslint`

-chai (for testing) `npm i chai`

-supertest `npm i supertest`


To run the development server, move into the root directory of the project and use the command: `npm run dev`

3. navigate to a url of your choice in the browser `http://localhost:9090/api`

4. To run tests use the command `npm t`

5. this is a url to the api hosted on heroku, here you will find a list of the different endpoints available:

`https://tom-nc-knews.herokuapp.com/api`

### Testing

The tests can be found in the spec directory. They test each endpoint for successful requests and various errors.
The errors tested for are 400, 404, 405, 422.

Each endpoint is thoroughly tested to make sure the endpoints respond in the way the user intended.

E.g.

```
 describe('/topics', () => {
    it('GET responds with a 200 and an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.have.all.keys('slug', 'description');
        expect(body.topics.length).to.equal(2);
      }));
```
In the above example the describe block tell us which endpoint we are testing. The it block tell us what we expect to happen when this url is requested. we test that we will recieve an array, and all the keys are what we expect then to be. We also check that the array is of the correct length.

### Deployment

To deploy on heroku, create a new heroku project and make a commit to Github with your latest changes. at this point you can push the project to Heroku. Make sure any confidential config details are stored in heroku config variables and the config file is gitignored.

### Authors

Thomas Wall

### Acknowledgements

Thanks to Northcoder for providing the instructions for this back end project.



