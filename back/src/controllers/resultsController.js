const { serviceResultLoteria } = require("../services/serviceLoteria");

const getResultLoteria = async (req, res, next) => {
  try {
    const  { typeLottery }  = req.params; // Agora pega o tipo corretamente da URL
    console.log('Tipo de loteria:', typeLottery);
    

    if (!['mega', 'lotofacil', 'quina'].includes(typeLottery)) {
      return res.status(400).json({ error: "O tipo de loteria informado é inválido. Por favor, use um dos seguintes tipos válidos: mega, lotofacil ou quina" });
    }

    const result = await serviceResultLoteria(typeLottery);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getResultLoteria };
