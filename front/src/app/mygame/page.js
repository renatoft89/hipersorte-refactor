"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GetDrawResults, getSavedUserBets } from '../../services/requests';

const MyGame = () => {
  const router = useRouter();
  const [jogosSalvos, setJogosSalvos] = useState([]);
  const [resultApi, setResultApi] = useState([]);
  const [acertosPorJogo, setAcertosPorJogo] = useState([]);
  const [loteriaSelecionada, setLoteriaSelecionada] = useState('mega');
  const [concursoSelecionado, setConcursoSelecionado] = useState('');
  const [concursosDisponiveis, setConcursosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loterias = [
    { nome: 'Mega Sena', valor: 'mega' },
    { nome: 'Lotofácil', valor: 'lotofacil' },
    { nome: 'Quina', valor: 'quina' }
  ];

  // Verifica autenticação antes de qualquer requisição
  const checkAuth = () => {
    const userString = localStorage.getItem('USER');
    if (!userString) {
      router.push('/login');
      return false;
    }
    
    try {
      const user = JSON.parse(userString);
      if (!user?.id || !user?.token) {
        router.push('/login');
        return false;
      }
      return true;
    } catch {
      router.push('/login');
      return false;
    }
  };

  // Busca resultados da loteria
  useEffect(() => {
    if (!checkAuth()) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await GetDrawResults('drawresults', loteriaSelecionada);
        setResultApi(data);
        setConcursosDisponiveis(data);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError('Erro ao buscar resultados da loteria.');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [loteriaSelecionada, router]);

  // Busca jogos salvos do usuário
  useEffect(() => {
    if (!checkAuth()) return;

    const fetchSavedBets = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = JSON.parse(localStorage.getItem('USER'));
        const response = await getSavedUserBets(`usergames/${user.id}`, loteriaSelecionada);
        
        if (!response || !Array.isArray(response)) {
          setJogosSalvos([]);
          return;
        }

        const jogosSalvosFormatados = response
          .filter(jogo => Array.isArray(jogo))
          .map(jogo => jogo.map(numero => numero.toString()));
          
        setJogosSalvos(jogosSalvosFormatados);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError('Erro ao buscar jogos salvos.');
          console.error(err);
        }
        setJogosSalvos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBets();
  }, [loteriaSelecionada, router]);

  // Calcula acertos
  useEffect(() => {
    if (!jogosSalvos.length || !resultApi.length || !concursoSelecionado) {
      setAcertosPorJogo([]);
      return;
    }

    try {
      const resultadoAtual = resultApi.find(concurso => 
        Array.isArray(concurso) && concurso[0] === concursoSelecionado.toString()
      ) || [];

      const numerosSorteados = resultadoAtual.slice(1).map(num => num.toString());
      const novosAcertos = jogosSalvos
        .filter(jogo => jogo[0] === resultadoAtual[0])
        .map(jogo => ({
          jogo,
          acertos: jogo.slice(1).filter(numero => numerosSorteados.includes(numero))
        }));

      setAcertosPorJogo(novosAcertos);
    } catch (err) {
      console.error('Erro ao calcular acertos:', err);
      setAcertosPorJogo([]);
    }
  }, [jogosSalvos, resultApi, concursoSelecionado]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-full md:max-w-full lg:max-w-screen-xl mt-10 mb-10">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Meus Jogos</h2>

        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          <div className="w-full sm:w-1/2">
            <label htmlFor="loteria" className="block text-center text-lg mb-2">Selecione a Loteria:</label>
            <select
              id="loteria"
              value={loteriaSelecionada}
              onChange={(e) => {
                setLoteriaSelecionada(e.target.value);
                setAcertosPorJogo([]);
                setConcursoSelecionado('');
                setResultApi([]);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring focus:ring-blue-500"
            >
              {loterias.map((loteria) => (
                <option key={loteria.valor} value={loteria.valor}>{loteria.nome}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/2">
            <label htmlFor="concurso" className="block text-center text-lg mb-2">Selecione o Concurso:</label>
            <select
              id="concurso"
              value={concursoSelecionado}
              onChange={(e) => setConcursoSelecionado(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring focus:ring-blue-500"
              disabled={!concursosDisponiveis.length}
            >
              <option value="">Selecione um concurso</option>
              {concursosDisponiveis.map((concurso) => (
                <option key={concurso[0]} value={concurso[0]}>{`Concurso ${concurso[0]}`}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : acertosPorJogo.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {acertosPorJogo.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">Concurso: {item.jogo[0]}</h3>
                <div className="flex flex-wrap justify-center mt-2">
                  {item.jogo.slice(1).map((numero, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-center rounded-full h-12 w-12 text-xl m-1 shadow-lg 
                        ${item.acertos.includes(numero) ? 'bg-green-500 text-white border-2 border-green-600' : 'bg-purple-600 text-white'}`}>
                      {numero}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-center font-semibold">Acertos: {item.acertos.length}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">Nenhum jogo salvo encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default MyGame;