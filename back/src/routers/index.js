const express = require('express');

const router = express.Router();

const resultsRouter = require('./results');
const registerRouter = require('./users/index');
const updateUserRouter = require('./users/index');
const authRouter = require('./users/index');

router.use('/results', resultsRouter);
router.use('/register', registerRouter.createUserRouter);
router.use('/update', updateUserRouter.updateUserRouter);
router.use('/login', authRouter.authUserRouter);

module.exports = router;