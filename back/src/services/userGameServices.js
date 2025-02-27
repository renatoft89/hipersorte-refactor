const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Função para salvar os jogos apostados do usuário
const saveUsersGame = async (userId, gameType, numbers) => {
  try {
    // Validação de tipo de loteria
    if (!['mega', 'lotofacil', 'quina'].includes(gameType)) {
      throw new Error("Tipo de loteria inválido. Os tipos válidos são: mega, lotofacil ou quina.");
    }

    // Salvando a aposta no banco de dados na tabela UserGames
    const newGame = await prisma.userGames.create({
      data: {
        game_type: gameType,
        numbers: JSON.stringify(numbers), // Armazenando os números como uma string JSON
        user_id: userId,  // Associando ao usuário
      },
    });

    return newGame;
  } catch (error) {
    throw new Error(`Erro ao salvar os jogos: ${error.message}`);
  }
};

// Função para obter os jogos apostados de um usuário
const getUserGames = async (typeLottery, userId) => {
  try {
    // Validação de tipo de loteria
    if (!['mega', 'lotofacil', 'quina'].includes(typeLottery)) {
      throw new Error("Tipo de loteria inválido. Os tipos válidos são: mega, lotofacil ou quina.");
    }

    // Buscando os jogos do usuário no banco, filtrados pelo tipo de loteria
    const userGames = await prisma.userGames.findMany({
      where: {
        user_id: userId,
        game_type: typeLottery,
      },
    });

    // Caso o usuário não tenha jogos para o tipo de loteria
    if (userGames.length === 0) {
      return { message: "Nenhum jogo encontrado para este usuário e tipo de loteria." };
    }

    return userGames;
  } catch (error) {
    throw new Error(`Erro ao buscar jogos do usuário: ${error.message}`);
  }
};

module.exports = { saveUsersGame, getUserGames };