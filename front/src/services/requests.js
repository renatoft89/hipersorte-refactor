import axios from 'axios';

export const api = axios.create({
  baseURL: `http://localhost:${process.env.PORT || '3001'}`,
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


export const GetDrawResults = async (endpoint, typeLottery) => {
  try {
    const dataUser = localStorage.getItem('USER');
    const token = JSON.parse(dataUser).token;
    // console.log('Token:', token); // Adicione este log para depuração
    
    const response = await api.get(`${endpoint}/${typeLottery}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

export const getSavedUserBets = async (endpoint, typeLottery) => {
  try {
    const dataUser = localStorage.getItem('USER');
    const token = JSON.parse(dataUser).token;
    console.log('Token:', token); // Adicione este log para depuração
    
    const response = await api.get(`${endpoint}/${typeLottery}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }

};

export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

export class ServerError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ServerError';
    this.status = status || 500;
  }
}

export const saveUserLotteryBet = async (userId, lotteryType, data) => {
  try {
    // Obtém o token do localStorage
    const dataUser = localStorage.getItem('USER');
    
    // Verifica se o usuário está autenticado
    if (!dataUser) {
      throw new AuthenticationError('Usuário não autenticado');
    }
    
    const user = JSON.parse(dataUser);
    const token = user.token;

    // Validação básica dos dados
    if (!Array.isArray(data) || data.length < 6) {
      throw new ValidationError('Dados da aposta inválidos');
    }
    
    // Corpo da requisição
    const body = {
      userId,
      lotteryType,
      data
    };
    
    // Fazendo a requisição POST com o token no header
    const response = await api.post(
      `usergames/${lotteryType}/save`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Aposta salva com sucesso:', response.data);
    return response.data;

  } catch (error) {
    console.error('Erro ao salvar a aposta:', error);
    
    // Tratamento específico para token inválido/expirado
    if (error.response?.status === 401) {
      localStorage.removeItem('USER');
      throw new AuthenticationError('Sessão expirada. Por favor, faça login novamente.');
    }
    
    // Se já for um erro customizado, apenas repassa
    if (error instanceof AuthenticationError || 
        error instanceof ValidationError || 
        error instanceof ServerError) {
      throw error;
    }
    
    // Para outros erros, cria um ServerError
    throw new ServerError(
      error.response?.data?.message || 'Erro ao salvar a aposta',
      error.response?.status
    );
  }
};

export const getNextContest = async (endpoint, typeLottery) => {
  const response = await api.get(`${endpoint}/${typeLottery}`);  

  return response.data[0].currentContest;
};



export default api;
