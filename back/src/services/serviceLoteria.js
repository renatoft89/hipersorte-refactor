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
    console.error(`Erro ao salvar os resultados da ${typeLottery}:`, error);
    throw new Error('Erro interno do servidor');
  }
};

const serviceContextLottery = async (typeLottery) => {
  try {
    const contest = await prisma.contest.findMany({
      where: {
        game_type: typeLottery, // Filtro pelo tipo de loteria
      },
      select: {
        currentContest: true,
        game_type: true
      }
    });

    console.log('Concursos encontrados:', contest);

    if (contest.length === 0) {
      // Se não encontrar concursos no banco, faz o scraping para buscar o número mais recente
      console.log('Concursos não encontrados no banco. Iniciando scraping...');

      const resultados = await getResultsLoteria(typeLottery); // Aqui você faz o scraping usando sua função já existente
      const concursoAtual = resultados.concurso;

      // Salva o concurso no banco de dados
      await prisma.contest.create({
        data: {
          game_type: typeLottery,
          currentContest: concursoAtual,
        }
      });

      return { currentContest: concursoAtual, game_type: typeLottery };
    }

    return contest; // Retorna os concursos encontrados

  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    throw new Error('Erro interno do servidor');
  }
};

module.exports = {
  serviceResultLoteria,
  serviceContextLottery
};
