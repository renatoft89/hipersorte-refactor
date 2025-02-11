const express = require('express');
const cors = require('cors');
const errorMiddleware = require('../middlewares/error.middleware');

const app = express();

app.use(express.json());

const router = require('../routers/index');

app.use(cors());
app.use(router);
app.use(errorMiddleware);

module.exports = app;