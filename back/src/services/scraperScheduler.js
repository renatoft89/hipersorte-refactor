const cron = require('node-cron');
const { serviceResultLoteria } = require('./serviceLoteria'); // Importa a função de serviço

// Agendar execução nos dias específicos (segunda, quarta e sexta às 10h)
cron.schedule('00 21 * * 1,2,5', async () => {
  console.log('Executando scraping das loterias...');
  console.log('Horário:', new Date().toLocaleString('pt-BR', { hour12: false }));

  try {
    // Executa para Lotofácil
    console.log('Buscando resultados da Lotofácil...');
    const lotofacilResults = await serviceResultLoteria('lotofacil');
    console.log('Lotofácil processada:', lotofacilResults);

    // Executa para Mega-Sena
    console.log('Buscando resultados da Mega-Sena...');
    const megaResults = await serviceResultLoteria('mega');
    console.log('Mega-Sena processada:', megaResults);

    // Executa para Quina
    console.log('Buscando resultados da Quina...');
    const quinaResults = await serviceResultLoteria('quina');
    console.log('Quina processada:', quinaResults);

  } catch (error) {
    console.error('Erro ao executar o scraping das loterias:', error);
  }
}, {
  timezone: 'America/Sao_Paulo'
});

console.log('Agendador de loterias configurado.');
