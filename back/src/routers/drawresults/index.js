const express = require('express');
const { getDrawResults } = require('../../controllers/drawResultsController');

const drawResultsRouter = express.Router();

drawResultsRouter.get('/:typeLottery', getDrawResults);

module.exports = drawResultsRouter;