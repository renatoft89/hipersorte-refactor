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

export const getResultsLoto = async () => {
  // Dados simulados do concurso 3231 da Lotofácil com 15 números
  return [[3231, 1, 2, 3, 4, 5, 6, 9, 16, 18, 19, 20, 22, 23, 24, 25]]; // Exemplo de dezenas da Lotofácil
};



export default api;
