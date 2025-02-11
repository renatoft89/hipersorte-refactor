const express = require('express');
const { getResultLoteria } = require('../../controllers/resultsController');

const resultsRouter = express.Router();

// Agora a rota aceita um parâmetro dinâmico (:tipo) para especificar o tipo da loteria (mega ou lotofacil)
resultsRouter.get('/:typeLottery', getResultLoteria);

module.exports = resultsRouter;
