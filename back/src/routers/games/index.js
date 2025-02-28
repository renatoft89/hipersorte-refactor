const express = require('express');

const { saveUsersGameController, getUserGamesController } = require('../../controllers/userGameController');

const userGamesRouter = express.Router();

userGamesRouter.get('/:userId/:typeLottery', getUserGamesController);
userGamesRouter.post('/:typeLottery/save', saveUsersGameController);

module.exports = userGamesRouter;