const routes = require('express').Router();
const stateController = require('../controllers/StateControllers');
routes.post("/addstate", stateController.addState);
routes.get("/", stateController.getAllStates);
module.exports = routes;