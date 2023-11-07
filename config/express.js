require("./mysql");
const express = require("express");
const cors = require("cors");
const app = express();
const appApi = require("../components/index");

// middleware
app.use(cors());
app.use(express.json());

app.use(appApi);

app.use((req, res) => {
  res.status(400).json({
    status: "error",
    message: "requested source not found",
  });
});

module.exports = app;
