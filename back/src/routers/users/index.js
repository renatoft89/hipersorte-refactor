const express = require('express');
const { createUsers, updateUsers} = require('../../controllers/userController');
const { validateUserData } = require('../../middlewares/user.middleware');
const { authController } = require('../../controllers/authController');

const createUserRouter = express.Router();
const updateUserRouter = express.Router();
const authUserRouter = express.Router();


createUserRouter.post('/user',validateUserData, createUsers)
updateUserRouter.put('/user/:id',validateUserData, updateUsers);
authUserRouter.post('/auth', authController);


module.exports = { createUserRouter, updateUserRouter, authUserRouter } ;