const express = require('express');

const router = express.Router();

const userGamesRouter = require('./games/index');
const resultsRouter = require('./results/index');
const drawResultsRouter = require('./drawresults/index');
const contestLotteryRouter = require('./contest/index');
const registerRouter = require('./users/index');
const updateUserRouter = require('./users/index');
const authRouter = require('./users/index');

router.use('/results', resultsRouter);
router.use('/userGames', userGamesRouter);
router.use('/drawresults', drawResultsRouter);
router.use('/contest', contestLotteryRouter);
router.use('/register', registerRouter.createUserRouter);
router.use('/update', updateUserRouter.updateUserRouter);
router.use('/login', authRouter.authUserRouter);

module.exports = router;