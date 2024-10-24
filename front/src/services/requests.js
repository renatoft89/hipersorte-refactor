import axios from 'axios';

export const api = axios.create({
  baseURL: `http://localhost:${process.env.REACT_APP_API_PORT || '3001'}`,
  apiEndPoint: `https://apiloterias.com.br/app/resultado?loteria=lotofacil&token=kJdfLjd38Jai2ek`
});

export const regRegisterUser = async (endpoint, body) => {
  const { data } = await api.post(endpoint, body);
  
  return data;
};

export const authUser = async (endpoint, body) => {
  const { data } = await api.post(endpoint, body);
  
  return data;
};

export const getResultsLoto = async (apiEndPoint) => {
  try {
    const response = await axios.get(apiEndPoint);
    console.log('Response data:', response.data); // Adicione esta linha para depuração
    return response.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
};
export default api;
