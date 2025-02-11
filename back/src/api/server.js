require('dotenv').config();
require('../services/scraperScheduler'); // Importa e ativa o agendador

const app = require('./api');

const PORT = process.env.PORT;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log('Online Port: ', PORT, `http://localhost:${PORT}/`));