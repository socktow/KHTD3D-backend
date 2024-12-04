const cors = require("cors");
const express = require("express");

const setupMiddleware = (app) => {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
};

module.exports = setupMiddleware;
