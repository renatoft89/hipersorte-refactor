const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Função para salvar os jogos apostados do usuário
const saveUsersGame = async (userId, gameType, numbers) => {
  try {
    if (!['mega', 'lotofacil', 'quina'].includes(gameType)) {
      throw new Error("Tipo de loteria inválido. Os tipos válidos são: mega, lotofacil ou quina.");
    }

    // Convertendo todos os números para strings com dois dígitos
    const formattedNumbers = numbers.map(num => num.toString().padStart(2, '0'));

    const newGame = await prisma.userGames.create({
      data: {
        game_type: gameType,
        numbers: JSON.stringify(formattedNumbers), // Salvando os números formatados
        user_id: userId,
      },
    });

    return newGame;
  } catch (error) {
    throw new Error(`Erro ao salvar os jogos: ${error.message}`);
  }
};


// Função para obter os jogos apostados de um usuário
const getUserGames = async (userId, typeLottery) => {
  try {
    // Validação de tipo de loteria
    const validTypes = ['mega', 'lotofacil', 'quina'];
    if (!validTypes.includes(typeLottery)) {
      throw new Error(`Tipo de loteria inválido. Os tipos válidos são: ${validTypes.join(', ')}.`);
    }

    // Convertendo o userId para número inteiro
    const userIdNumber = parseInt(userId, 10);

    // Verificando se a conversão foi bem-sucedida
    if (isNaN(userIdNumber)) {
      throw new Error("O ID do usuário deve ser um número válido.");
    }

    // Buscando os jogos do usuário no banco, filtrados pelo tipo de loteria
    const userGames = await prisma.userGames.findMany({
      where: {
        user_id: userIdNumber, // Passando o userId como número
        game_type: typeLottery,
      },
    });

    // Caso o usuário não tenha jogos para o tipo de loteria
    if (userGames.length === 0) {
      return { message: `Nenhum jogo encontrado para o usuário ${userIdNumber} na loteria ${typeLottery}.` };
    }

    // Transformando os jogos no formato desejado (array de arrays)
    const formattedGames = userGames.map((game) => {
      // Supondo que `game.numbers` seja uma string (por exemplo: "[3328,2,4,5,6,8,9,10,12,13,14,15,16,17,18,19,20,21,23,24,25]")
      // Converta essa string para um array de números
      const numbers = JSON.parse(game.numbers); // Converte a string para um array

      // Retorna o número 3329 (ou qualquer outro que você queira) como primeiro número no array
      return  [...numbers]
    });

    return formattedGames; // Retorna o array de arrays formatado
  } catch (error) {
    // Log de erro para depuração (opcional)
    console.error(`Erro ao buscar jogos para o usuário ${userId} na loteria ${typeLottery}: ${error.message}`);

    // Lançando o erro com uma mensagem amigável
    throw new Error(`Erro ao buscar jogos: ${error.message}`);
  }
};



module.exports = { saveUsersGame, getUserGames };