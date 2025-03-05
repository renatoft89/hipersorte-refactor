const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const serviceDrawResults = async (typeLottery) => {
  try {
    // Verifica se o tipo de loteria é válido
    if (!['mega', 'lotofacil', 'quina'].includes(typeLottery)) {
      throw new Error('Tipo de loteria inválido. Use "mega", "lotofacil" ou "quina".');
    }

    // Busca TODOS os resultados da loteria especificada, ordenados do mais recente para o mais antigo
    const drawresults = await prisma.bet.findMany({
      where: { game_type: typeLottery },
      orderBy: { createdAt: 'desc' } // Ordena para mostrar os mais recentes primeiro
    });

    // Verifica se existem resultados
    if (drawresults.length === 0) {
      console.error(`Nenhum resultado encontrado para a loteria ${typeLottery}.`);
      throw new Error('Nenhum resultado encontrado.');
    }

    console.log('Resultados encontrados:', drawresults);

    // Mapeia os resultados para extrair apenas os números de cada sorteio, removendo o número do concurso
    const allNumbers = drawresults.map((result) => {
      let numbersArray = JSON.parse(result.numbers); // Converte a string JSON em um array
      return numbersArray; // Remove o primeiro item (número do concurso) e retorna apenas os números sorteados
    });

    return allNumbers;
  }
  catch (error) {
    console.error(`Erro ao consultar os resultados da ${typeLottery}:`, error);
    throw new Error('Erro interno do servidor');
  }
};

module.exports = { serviceDrawResults };
