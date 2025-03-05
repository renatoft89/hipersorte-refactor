import axios from 'axios';

export const api = axios.create({
  baseURL: `http://localhost:${process.env.REACT_APP_API_PORT || '3001'}`,
  apiEndPoint: `https://apiloterias.com.br/app/v2/resultado?loteria=lotofacil&token=kJdfLjd38Jai2ek&concurso=ultimos1`
});

export const regRegisterUser = async (endpoint, body) => {
  const { data } = await api.post(endpoint, body);
  
  return data;
};

export const authUser = async (endpoint, body) => {
  const { data } = await api.post(endpoint, body);
  
  return data;
};

/*export const getResultsLoto = async (apiEndPoint) => {
  try {
    const response = await axios.get(apiEndPoint);
    // const numeroConcurso = response.data.numero_concurso; // Supondo que a API retorna o número do concurso
    const numeroConcurso = 2236
    const dezenas = response.data.dezenas.map(num => parseInt(num, 10)); // Converte as dezenas para inteiros

    // Combina o número do concurso e as dezenas em um único array
    const arrayReturn = [[numeroConcurso, ...dezenas]];
    
    return arrayReturn;
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
};*/

export const GetDrawResults = async (endpoint, typeLottery) => {
  // Dados simulados do concurso 3231 da Megasena com 15 números
  // return [[2791, 2, 3, 11, 25, 37, 43]]; // Exemplo de dezenas da Megasena
  const  response   = await api.get(`${endpoint}/${typeLottery}`)
    
  return response.data
  
  
};

export const getSavedUserBets = async (endpoint, typeLottery) => {
  const response = await api.get(`${endpoint}/${typeLottery}`);

  // console.log(response.data);
  

  return response.data;

};

export const saveUserLotteryBet = async (userId, lotteryType, data) => {
  
  const body = {
    userId,
    lotteryType,
    data
  }
  

  try {
    // Fazendo a requisição POST com axios para salvar os dados no servidor
    const response = await api.post(`usergames/${lotteryType}/save`, body);

    // Verifica a resposta e retorna o resultado
    console.log('Aposta salva com sucesso:', response.data);
    return response.data; // Retorna os dados da resposta, caso necessário para processamento posterior

  } catch (error) {
    console.error('Erro ao salvar a aposta:', error); // Log do erro
    throw error; // Relança o erro para ser tratado em outro lugar
  }
};

export const getNextContest = async (endpoint, typeLottery) => {
  const response = await api.get(`${endpoint}/${typeLottery}`);  

  return response.data[0].currentContest;
};



export default api;
