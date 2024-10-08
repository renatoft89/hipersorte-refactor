import axios from 'axios';

export const api = axios.create({
  baseURL: `http://localhost:${process.env.REACT_APP_API_PORT || '3001'}`,
});

export const regRegisterUser = async (endpoint, body) => {
  const { data } = await api.post(endpoint, body);
  
  return data;
};

export const authUser = async (endpoint, body) => {
  const { data } = await api.post(endpoint, body);
  
  return data;
};

export default api;
