const { getResultsLoteria } = require('../getApi/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const serviceResultLoteria = async (typeLottery) => {
  try {
    if (!['mega', 'lotofacil', 'quina'].includes(typeLottery)) {
      throw new Error('Tipo de loteria inválido. Use "mega" ou "lotofacil".');
    }

    const resultados = await getResultsLoteria(typeLottery);

    // Formata os números para incluir o concurso na posição zero
    const formattedNumbers = [resultados.concurso, ...resultados.numeros];

    // Converte para string para armazenar no banco
    const numbersString = JSON.stringify(formattedNumbers);

    // Verifica se já existem registros do tipo especificado
    const existingBets = await prisma.bet.findMany({
      where: {
        game_type: typeLottery
      }
    });

    if (existingBets.length === 0) {
      // Se não houver registros, insere novos dados
      await prisma.bet.create({
        data: {
          game_type: typeLottery,
          numbers: numbersString,
          user_id: 1 // Ajuste conforme necessário
        }
      });
    } else {
      // Se houver registros, atualiza os números
      await prisma.bet.updateMany({
        where: {
          game_type: typeLottery
        },
        data: {
          numbers: numbersString
        }
      });
    }

    return resultados;

  } catch (error) {
    console.error(`Erro ao salvar os resultados da ${tipoLoteria}:`, error);
    throw new Error('Erro interno do servidor');
  }
};

module.exports = {
  serviceResultLoteria,
};
