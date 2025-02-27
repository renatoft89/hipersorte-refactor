const { saveUsersGame, getUserGames } = require("../services/userGameServices");


const saveUsersGameController = async (req, res, next) => {
  try {
    const { userId, typeLottery } = req.params;
    console.log("Tipo de userId antes da conversão:", typeof userId, userId);
    const result = await saveUsersGame(userId, typeLottery);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

const getUserGamesController = async (req, res, next) => {
  try {
    const  { typeLottery, userId }  = req.params; // Agora pega o tipo corretamente da URL
    console.log('Tipo de loteria:', typeLottery, userId);
    

    if (!['mega', 'lotofacil', 'quina'].includes(typeLottery)) {
      return res.status(400).json({ error: "O tipo de loteria informado é inválido. Por favor, use um dos seguintes tipos válidos: mega, lotofacil ou quina" });
    }

    const result = await getUserGames(typeLottery, userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { saveUsersGameController, getUserGamesController };