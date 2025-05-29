const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const serviceDrawResults = async (typeLottery) => {
  try {
    if (!['mega', 'lotofacil', 'quina'].includes(typeLottery)) {
      throw new Error('Tipo de loteria inválido. Use "mega", "lotofacil" ou "quina".');
    }

    const drawresults = await prisma.bet.findMany({
      where: { game_type: typeLottery },
      orderBy: { createdAt: 'desc' }
    });

    if (drawresults.length === 0) {
      console.error(`Nenhum resultado encontrado para a loteria ${typeLottery}.`);
      throw new Error('Nenhum resultado encontrado.');
    }

    console.log('Resultados encontrados:', drawresults);

    // Converte todos os números para strings
    const allNumbers = drawresults.map((result) => {
      let numbersArray = JSON.parse(result.numbers);
      return numbersArray.map(num => num.toString().padStart(2, '0')); // Garante que todos tenham 2 dígitos
    });

    return allNumbers;
  }
  catch (error) {
    console.error(`Erro ao consultar os resultados da ${typeLottery}:`, error);
    throw new Error('Erro interno do servidor');
  }
};


module.exports = { serviceDrawResults };
