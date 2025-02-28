const { saveUsersGame, getUserGames } = require("../services/userGameServices");


const saveUsersGameController = async (req, res, next) => {
  try {
    const { typeLottery } = req.params; // Agora pega o tipo corretamente da URL
    const { data, userId } = req.body;

    const result = await saveUsersGame(userId, typeLottery, data);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

const getUserGamesController = async (req, res, next) => {
  try {
    const  { typeLottery, userId }  = req.params; // Agora pega o tipo corretamente da URL
    
    if (!['mega', 'lotofacil', 'quina'].includes(typeLottery)) {
      return res.status(400).json({ error: "O tipo de loteria informado é inválido. Por favor, use um dos seguintes tipos válidos: mega, lotofacil ou quina" });
    }

    const result = await getUserGames(parseInt(userId, 10), typeLottery);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { saveUsersGameController, getUserGamesController };