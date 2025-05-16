require('dotenv').config();
require('../services/scraperScheduler'); // Importa e ativa o agendador

const app = require('./api');

const PORT = process.env.PORT;

const HOST = process.env.HOST || 'localhost';

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log('Online Port: ', PORT, `http://${HOST}:${PORT}`));