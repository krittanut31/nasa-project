const express = require("express");

const { getAllPlanets } = require("./planets.controller");

const planetesRouter = express.Router();

planetesRouter.get("/planets", getAllPlanets);

module.exports = planetesRouter;
