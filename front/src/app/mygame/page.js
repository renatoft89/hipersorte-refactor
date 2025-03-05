"use client";

import React, { useState, useEffect } from 'react';
import { GetDrawResults, getSavedUserBets } from '../../services/requests';

const MyGame = () => {
  // Estados
  const [jogosSalvos, setJogosSalvos] = useState([]);
  const [resultApi, setResultApi] = useState([]);
  const [acertosPorJogo, setAcertosPorJogo] = useState([]);
  const [loteriaSelecionada, setLoteriaSelecionada] = useState('mega');
  const [concursoSelecionado, setConcursoSelecionado] = useState('');
  const [concursosDisponiveis, setConcursosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Opções de loterias
  const loterias = [
    { nome: 'Mega Sena', valor: 'mega' },
    { nome: 'Lotofácil', valor: 'lotofacil' },
    { nome: 'Quina', valor: 'quina' }
  ];

  // Busca os resultados da loteria selecionada
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await GetDrawResults('drawresults', loteriaSelecionada);
        setResultApi(data);
        setConcursosDisponiveis(data); // Assume que data contém os concursos disponíveis
      } catch (err) {
        setError('Erro ao buscar resultados da loteria.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [loteriaSelecionada]);

  // Busca os jogos salvos do usuário
  useEffect(() => {
    const fetchSavedBets = async () => {
      try {
        const dadosSalvos = await getSavedUserBets('usergames/1', loteriaSelecionada);
        // Converte todos os números para strings para facilitar a comparação
        const jogosSalvosFormatados = dadosSalvos.map(jogo => 
          jogo.map(numero => numero.toString())
        );
        setJogosSalvos(jogosSalvosFormatados);
      } catch (err) {
        setError('Erro ao buscar jogos salvos.');
        console.error(err);
      }
    };

    fetchSavedBets();
  }, [loteriaSelecionada]);

  // Calcula os acertos por jogo quando o concurso é selecionado
  useEffect(() => {
    if (!jogosSalvos.length || !resultApi.length || !concursoSelecionado) return;

    // Encontrar o resultado do concurso selecionado
    const resultadoAtual = resultApi.find(concurso => 
      concurso[0] === concursoSelecionado.toString() // Converte para string para comparação
    );

    if (!resultadoAtual) return;

    // Obtém os números sorteados, excluindo o índice do concurso
    const numerosSorteados = resultadoAtual.slice(1);

    // Calcula os acertos para cada jogo salvo
    const novosAcertos = jogosSalvos
      .filter(jogo => jogo[0] === resultadoAtual[0]) // Filtra apenas os jogos do mesmo concurso
      .map(jogo => {
        const numerosJogo = jogo.slice(1);
        const acertos = numerosJogo.filter(numero => numerosSorteados.includes(numero));
        return { jogo, acertos };
      });

    setAcertosPorJogo(novosAcertos);
  }, [jogosSalvos, resultApi, concursoSelecionado]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-full md:max-w-full lg:max-w-screen-xl mt-10 mb-10">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Meus Jogos</h2>

        {/* Select para escolher a loteria e o concurso lado a lado */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          <div className="w-full sm:w-1/2">
            <label htmlFor="loteria" className="block text-center text-lg mb-2">Selecione a Loteria:</label>
            <select 
              id="loteria"
              value={loteriaSelecionada}
              onChange={(e) => {
                setLoteriaSelecionada(e.target.value);
                setAcertosPorJogo([]); // Limpa os acertos ao mudar a loteria
                setConcursoSelecionado(''); // Limpa o concurso selecionado
                setResultApi([]); // Limpa resultados anteriores
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
              disabled={!concursosDisponiveis.length} // Desabilita se não houver concursos disponíveis
            >
              <option value="">Selecione um concurso</option>
              {concursosDisponiveis.map((concurso) => (
                <option key={concurso[0]} value={concurso[0]}>{`Concurso ${concurso[0]}`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exibe resultados com base nos jogos salvos e no concurso selecionado */}
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