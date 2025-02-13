const express = require('express');

const router = express.Router();

const resultsRouter = require('./results/index');
const contestLottery = require('./contest/index');
const registerRouter = require('./users/index');
const updateUserRouter = require('./users/index');
const authRouter = require('./users/index');

router.use('/results', resultsRouter);
router.use('/contest', contestLottery);
router.use('/register', registerRouter.createUserRouter);
router.use('/update', updateUserRouter.updateUserRouter);
router.use('/login', authRouter.authUserRouter);

module.exports = router;