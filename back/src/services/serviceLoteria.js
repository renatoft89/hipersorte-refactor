const { getResultsLoteria } = require('../getApi/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para salvar ou atualizar os resultados da loteria
const serviceResultLoteria = async (typeLottery) => {
  console.log(`Buscando os resultados da ${typeLottery}...`);

  try {
    if (!['mega', 'lotofacil', 'quina'].includes(typeLottery)) {
      throw new Error('Tipo de loteria inválido. Use "mega", "lotofacil" ou "quina".');
    }

    const resultados = await getResultsLoteria(typeLottery);

    // Formata todos os números para string com dois dígitos
    const formattedNumbers = [
      resultados.concurso.toString(),
      ...resultados.numeros.map(num => num.toString().padStart(2, '0'))
    ];

    const numbersString = JSON.stringify(formattedNumbers);

    const existingBet = await prisma.bet.findFirst({
      where: { 
        game_type: typeLottery, 
        numbers: {
          contains: resultados.concurso.toString()
        }
      }
    });

    if (existingBet) {
      console.log(`O concurso ${resultados.concurso} já foi registrado para a loteria ${typeLottery}. Nenhuma alteração feita.`);
      return resultados;
    }

    await prisma.bet.create({
      data: {
        game_type: typeLottery,
        numbers: numbersString,
        user_id: 1
      }
    });
    console.log(`Novo resultado para o concurso ${resultados.concurso} da loteria ${typeLottery} inserido.`);

    return resultados;
  } catch (error) {
    console.error(`Erro ao salvar os resultados da ${typeLottery}:`, error);
    throw new Error('Erro interno do servidor');
  }
};



const serviceContextLottery = async (typeLottery) => {
  console.log(`Buscando o próximo concurso da ${typeLottery}...`);

  try {
    // Validação do tipo de loteria
    if (!['mega', 'lotofacil', 'quina'].includes(typeLottery)) {
      throw new Error('Loteria não encontrada');
    }

    // Consulta o último concurso salvo no banco de dados usando Prisma
    const lastContest = await prisma.bet.findMany({
      where: { game_type: typeLottery },
      orderBy: { numbers: 'desc' }
    });

    // Verifica se encontrou algum concurso e se o campo numbers é válido
    if (!lastContest || lastContest.length === 0 || !lastContest[0].numbers) {
      console.error(`Não foi possível obter o último concurso da ${typeLottery}.`);
      throw new Error('Não foi possível obter o último concurso do banco de dados');
    }

    // Converte o campo numbers de JSON string para um array
    const numbersArray = JSON.parse(lastContest[0].numbers);
    if (!Array.isArray(numbersArray) || numbersArray.length === 0) {
      console.error(`O formato de números do concurso da ${typeLottery} não é válido.`);
      throw new Error('O número do concurso não é válido');
    }

    // O primeiro número da lista é o número do concurso
    const lastNumber = parseInt(numbersArray[0], 10);
    if (isNaN(lastNumber)) {
      console.error(`O número do concurso da ${typeLottery} não é válido.`);
      throw new Error('O número do concurso não é válido');
    }

    // Calcula o próximo concurso
    const nextContest = lastNumber + 1;
    const contest = [{
      currentContest: nextContest,
      game_type: typeLottery
    }];

    console.log(`Próximo concurso da ${typeLottery}:`, contest);
    return contest;

  } catch (error) {
    console.error(`Erro ao buscar o próximo concurso da ${typeLottery}:`, error);
    throw new Error('Erro interno do servidor');
  }
};



module.exports = {
  serviceResultLoteria,
  serviceContextLottery
};
