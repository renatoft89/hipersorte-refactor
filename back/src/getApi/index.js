const puppeteer = require('puppeteer');

// Função para pegar os resultados da Mega-Sena
const getResultsMega = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',  // Caminho correto do Chromium
      headless: false
    });

    const page = await browser.newPage();
    console.log('Navegando para a página dos resultados...');
    await page.goto('https://loterias.caixa.gov.br/Paginas/default.aspx');

    console.log('Aguardando o carregamento dos elementos...');
    await page.waitForSelector('div.product', { timeout: 10000 });

    const lotoResults = await page.evaluate(() => {
      const results = {};

      // Função para capturar os números de um jogo
      const getNumbers = (selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.innerText.trim());
      };

      // Função para capturar o número do concurso
      const getConcurso = (selector) => {
        const element = document.querySelector(selector);
        if (element) {
          const texto = element.innerText.trim();
          const match = texto.match(/Concurso\s(\d+)/i);
          return match && match[1] ? match[1] : 'Desconhecido';
        }
        return 'Desconhecido';
      };

      // Função para capturar o valor estimado
      const getValorEstimado = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.innerText.trim() : 'Desconhecido';
      };

      // Mega-Sena
      results.megaSena = {
        numeros: getNumbers('ul.resultado-loteria.mega-sena li.ng-binding'),
        concurso: getConcurso('div.product.no-title p.description.ng-binding'),
        valorEstimado: getValorEstimado('h3.valor-estimado.valor-estimado-megasena.ng-binding'),
      };

      return results.megaSena; // Retorna apenas os resultados da Mega-Sena
    });

    console.log('Resultados capturados:', lotoResults);
    await browser.close();
    console.log('Navegador fechado.');
    return lotoResults;
  } catch (error) {
    console.error('Erro ao buscar os resultados da Mega-Sena:', error);
    if (browser) {
      console.log('Fechando o navegador devido ao erro...');
      await browser.close();
    }
    return { error: 'Erro ao buscar os resultados da Mega-Sena' };
  }
};

// Função para pegar os resultados da Lotofacil
const getResultsLotofacil = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    console.log('Navegando para a página dos resultados...');
    await page.goto('https://loterias.caixa.gov.br/Paginas/Lotofacil.aspx');

    console.log('Aguardando o carregamento dos elementos...');
    await page.waitForSelector('div.product', { timeout: 10000 });

    const lotoResults = await page.evaluate(() => {
      const results = {};

      // Função para capturar os números de um jogo
      const getNumbers = (selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.innerText.trim());
      };

      // Função para capturar o número do concurso
      const getConcurso = () => {
        const element = document.querySelector('span.ng-binding');
        if (element) {
          const texto = element.innerText.trim();
          const match = texto.match(/Concurso\s(\d+)/i);
          return match && match[1] ? match[1] : 'Desconhecido';
        }
        return 'Desconhecido';
      };

      // Função para capturar o valor estimado do próximo prêmio
      const getValorEstimado = () => {
        const element = document.querySelector('div.next-prize p.value.ng-binding');
        return element ? element.innerText.trim() : 'Desconhecido';
      };

      // Lotofacil
      results.lotofacil = {
        numeros: getNumbers('ul.simple-container.lista-dezenas.lotofacil li.ng-binding.dezena.ng-scope'),
        concurso: getConcurso(),
        valorEstimado: getValorEstimado(),
      };

      return results.lotofacil; // Retorna apenas os resultados da Lotofacil
    });

    console.log('Resultados capturados:', lotoResults);
    await browser.close();
    console.log('Navegador fechado.');
    return lotoResults;
  } catch (error) {
    console.error('Erro ao buscar os resultados da Lotofacil:', error);
    if (browser) {
      console.log('Fechando o navegador devido ao erro...');
      await browser.close();
    }
    return { error: 'Erro ao buscar os resultados da Lotofacil' };
  }
};

const getResultsQuina = async () => {
  console.log('Buscando os resultados da Quina...');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    console.log('Navegando para a página dos resultados da Quina...');
    await page.goto('https://loterias.caixa.gov.br/Paginas/Quina.aspx');

    console.log('Aguardando o carregamento dos elementos...');
    await page.waitForSelector('div.product', { timeout: 10000 });

    const lotoResults = await page.evaluate(() => {
      const results = {};

      const getNumbers = (selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.innerText.trim());
      };

      const getConcurso = (selector) => {
        const element = document.querySelector(selector);
        if (element) {
          const texto = element.innerText.trim();
          const match = texto.match(/Concurso\s(\d+)/i);
          return match && match[1] ? match[1] : 'Desconhecido';
        }
        return 'Desconhecido';
      };

      const getValorEstimado = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.innerText.trim() : 'Desconhecido';
      };

      // Quina
      results.quina = {
        numeros: getNumbers('ul.numbers.quina li.ng-binding'), // Coleta os números sorteados
        concurso: getConcurso('h2 span.ng-binding'), // Coleta o concurso
        valorEstimado: getValorEstimado('div.next-prize .value.ng-binding'), // Coleta o valor estimado do próximo prêmio      
      };

      return results.quina;
    });

    console.log('Resultados da Quina capturados:', lotoResults);
    await browser.close();
    console.log('Navegador fechado.');
    return lotoResults;
  } catch (error) {
    console.error('Erro ao buscar os resultados da Quina:', error);
    if (browser) {
      await browser.close();
    }
    return { error: 'Erro ao buscar os resultados da Quina' };
  }
};

const getNextContest = async (typeLottery) => {
  try {
    const url = `https://www.loteriasonline.caixa.gov.br/silce-web/#/${typeLottery}`;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Supondo que o próximo concurso está em um seletor específico, ajuste conforme necessário
    const nextContest = await page.evaluate(() => {
      const element = document.querySelector('#proximoConcurso');
      return element ? parseInt(element.innerText.trim(), 10) : null;
    });

    await browser.close();

    if (!nextContest) {
      throw new Error('Não foi possível extrair o próximo concurso');
    }

    return nextContest;
  } catch (error) {
    console.error('Erro ao obter próximo concurso:', error);
    throw new Error('Erro ao buscar próximo concurso');
  }
};



// Função principal que escolhe qual loteria chamar com base no parâmetro
const getResultsLoteria = async (lotteryType) => {
  // Mapeamento de tipos de loteria para funções correspondentes
  const lotteryFunctions = {
    mega: getResultsMega,
    lotofacil: getResultsLotofacil,
    quina: getResultsQuina,
  };

  // Verifica se a loteria é válida e chama a função correspondente
  if (lotteryFunctions[lotteryType]) {
    return await lotteryFunctions[lotteryType]();
  } else {
    return { error: 'Tipo de loteria inválido. Use "mega", "lotofacil" ou "quina".' };
  }
};



module.exports = { getResultsLoteria, getNextContest };
