const express = require('express');
const bodyParser = require('body-parser');
const { error404, handle422, handle400 } = require('./errors/errors');
const apiRouter = require('./routers/apiRouter');

const app = express();


app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(error404);

app.use(handle422);

app.use(handle400);

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).send({ status: err.status, message: err.message });
  }
  return res.status(500).send({ status: 500, message: 'Internal server error' });
});

module.exports = app;
