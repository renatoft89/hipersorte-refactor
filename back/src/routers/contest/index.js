const express = require('express');

const { getContestLottery } = require('../../controllers/resultsController');


const contestRouter = express.Router();

contestRouter.get('/:typeLottery', getContestLottery);

module.exports = contestRouter;
