"use client";

import React, { useState, useEffect } from 'react';
import { getResultsLoto, getResultsMega, getResultsQuina } from '@/services/requests'; // Importando a função para Quina

const MyGame = () => {
  const [jogosSalvos, setJogosSalvos] = useState([]);
  const [resultApi, setResultApi] = useState([]);
  const [acertosPorJogo, setAcertosPorJogo] = useState([]);
  const [loteriaSelecionada, setLoteriaSelecionada] = useState('lotofacil');
  const [concursoSelecionado, setConcursoSelecionado] = useState('');
  const [concursosDisponiveis, setConcursosDisponiveis] = useState([]);

  const loterias = [
    { nome: 'Mega Sena', valor: 'MegaSena' },
    { nome: 'Lotofácil', valor: 'lotofacil' },
    { nome: 'Quina', valor: 'quina' }
  ];

  useEffect(() => {
    const fetchResults = async () => {
      let data = [];
      if (loteriaSelecionada === 'lotofacil') {
        data = await getResultsLoto();
      } else if (loteriaSelecionada === 'MegaSena') {
        data = await getResultsMega();
      } else if (loteriaSelecionada === 'quina') { // Adicionando verificação para Quina
        data = await getResultsQuina();
      }

      setResultApi(data);
      setConcursosDisponiveis(data); // Assume que data contém os concursos disponíveis
    };

    fetchResults();
    const dadosSalvos = JSON.parse(localStorage.getItem(`resultados${loteriaSelecionada.charAt(0).toUpperCase() + loteriaSelecionada.slice(1)}`)) || [];
    
    // Padroniza os números dos jogos salvos para inteiros
    const jogosSalvosComNumerosInteiros = dadosSalvos.map(jogo => [jogo[0], ...jogo.slice(1).map(num => parseInt(num, 10))]);
    setJogosSalvos(jogosSalvosComNumerosInteiros);
  }, [loteriaSelecionada]);

  useEffect(() => {
    if (jogosSalvos.length > 0 && resultApi.length > 0 && concursoSelecionado) {
      const resultadoAtual = resultApi.find(concurso => concurso[0] === parseInt(concursoSelecionado));
      if (resultadoAtual) {
        // Converte os números sorteados para inteiros
        const resultNumeros = resultadoAtual.slice(1).map(num => parseInt(num, 10));

        const novosAcertos = jogosSalvos.map(jogo => {
          if (jogo[0] === resultadoAtual[0]) {
            // Converte os números dos jogos salvos para inteiros e compara com os números sorteados
            const acertos = jogo.slice(1).map(num => parseInt(num, 10)).filter(numero => resultNumeros.includes(numero));

            return { jogo, acertos };
          }
          return { jogo, acertos: [] };
        });

        setAcertosPorJogo(novosAcertos);
      }
    }
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
        {acertosPorJogo.length > 0 ? (
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
