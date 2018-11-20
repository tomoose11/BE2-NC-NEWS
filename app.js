const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRouter = require("./routers/apiRouter");

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  next({ status: 404, message: "page not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(404).send({ status: err.status, message: err.message });
  } else {
    res.status(500).send({ status: 500, message: "Internal server error" });
  }
});

module.exports = app;
