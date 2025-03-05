const { serviceDrawResults } = require('../services/serviceDrawResults');

const getDrawResults = async (req, res, next) => {
  try {
    const { typeLottery } = req.params;
    const result = await serviceDrawResults(typeLottery);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDrawResults };