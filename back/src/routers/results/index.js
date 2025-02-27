const express = require('express');
const { getResultLoteria } = require('../../controllers/resultsController');


const resultsRouter = express.Router();

// Agora a rota aceita um parâmetro dinâmico (:tipo) para especificar o tipo da loteria (mega, lotofacile ou quina)
resultsRouter.get('/:typeLottery', getResultLoteria);


module.exports = resultsRouter;
