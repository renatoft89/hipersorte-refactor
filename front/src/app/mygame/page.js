"use client";

import React, { useState, useEffect } from 'react';
import { getResultsLoto } from '@/services/requests';

const MyGame = () => {
  const [jogosSalvos, setJogosSalvos] = useState([]);
  const [resultApi, setResultApi] = useState([]);
  const [acertosPorJogo, setAcertosPorJogo] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getResultsLoto('https://apiloterias.com.br/app/resultado?loteria=lotofacil&token=kJdfLjd38Jai2ek');
      setResultApi(data);
    };

    fetchResults();

    const dadosSalvos = JSON.parse(localStorage.getItem('resultadosLotofacil')) || [];
    setJogosSalvos(dadosSalvos);
  }, []);

  useEffect(() => {
    if (jogosSalvos.length > 0 && resultApi.length > 0) {
      const novosAcertos = jogosSalvos.map(jogo => {
        // Verifica se o número do concurso é igual
        if (jogo[0] === resultApi[0][0]) {
          const resultNumeros = resultApi[0].slice(1).map(num => parseInt(num, 10)); // Dezenas da API
          const acertos = jogo.slice(1).filter(numero => resultNumeros.includes(numero));
          return { jogo, acertos }; // Armazena o jogo e seus acertos
        } else {
          return { jogo, acertos: [] }; // Se o concurso for diferente, não há acertos
        }
      });
      setAcertosPorJogo(novosAcertos);
    }
  }, [jogosSalvos, resultApi]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-20 rounded-lg shadow-lg max-w-lg w-full mt-10 mb-10 sm:p-6">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Jogos Salvos da Lotofácil</h2>
        <ul className="mt-5">
          {acertosPorJogo.map((item, index) => (
            <li key={index} className="mb-4">
              <h3 className="text-lg font-semibold">Concurso: {item.jogo[0]}</h3>
              <ul className="mt-2 grid grid-cols-5 gap-1 justify-items-center">
                {item.jogo.slice(1).map((numero, i) => (
                  <li 
                    key={i} 
                    className={`flex items-center justify-center font-extrabold rounded-full h-20 w-20 text-3xl m-2 shadow-lg transition-transform transform hover:scale-110 hover:shadow-xl duration-300
                      ${item.acertos.includes(numero) ? 'bg-green-500 text-white border-2 border-green-600' : 'bg-purple-600 text-white'}`}>
                    {numero}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-center">Acertos: {item.acertos.length}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyGame;
