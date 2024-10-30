"use client";

import React, { useState, useEffect } from 'react';
import { getResultsLoto } from '@/services/requests';

const MyGame = () => {
  const [jogosSalvos, setJogosSalvos] = useState([]);
  const [resultApi, setResultApi] = useState([]);
  const [acertosPorJogo, setAcertosPorJogo] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getResultsLoto('https://apiloterias.com.br/app/resultado?loteria=lotofacil&token=kJdfLjd38Jai2ek');
        setResultApi(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
    const dadosSalvos = JSON.parse(localStorage.getItem('resultadosLotofacil')) || [];
    setJogosSalvos(dadosSalvos);
  }, []);

  useEffect(() => {
    if (jogosSalvos.length > 0 && resultApi.length > 0) {
      const novosAcertos = jogosSalvos.map(jogo => {
        const resultadoAtual = resultApi[0];
        if (jogo[0] === resultadoAtual[0]) {
          const resultNumeros = resultadoAtual.slice(1).map(num => parseInt(num, 10));
          const acertos = jogo.slice(1).filter(numero => resultNumeros.includes(numero));
          return { jogo, acertos };
        } 
        return { jogo, acertos: [] };
      });
      setAcertosPorJogo(novosAcertos);
    }
  }, [jogosSalvos, resultApi]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-full md:max-w-full lg:max-w-screen-xl mt-10 mb-10">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Meus Jogos Lotofácil</h2>
        {acertosPorJogo.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {acertosPorJogo.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">Concurso: {item.jogo[0]}</h3>
                <ul className="mt-2 grid grid-cols-5 gap-2 justify-items-center">
                  {item.jogo.slice(1).map((numero, i) => (
                    <li 
                      key={i} 
                      className={`flex items-center justify-center rounded-full h-12 w-12 text-xl m-1 shadow-lg 
                        ${item.acertos.includes(numero) ? 'bg-green-500 text-white border-2 border-green-600' : 'bg-purple-600 text-white'}`}>
                      {numero}
                    </li>
                  ))}
                </ul>
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
