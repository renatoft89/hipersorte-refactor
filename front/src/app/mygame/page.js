"use client";

import React, { useState, useEffect } from 'react';
import { getResultsLoto } from '@/services/requests';

const MyGame = () => {
  const [jogosSalvos, setJogosSalvos] = useState([]);
  const [resultApi, setResultApi] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getResultsLoto('https://apiloterias.com.br/app/resultado?loteria=lotofacil&token=kJdfLjd38Jai2ek');
      setResultApi(data);
    };
    console.log(resultApi);
    
    fetchResults();

    const dadosSalvos = JSON.parse(localStorage.getItem('resultadosLotofacil')) || [];
    setJogosSalvos(dadosSalvos);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-20 rounded-lg shadow-lg max-w-lg w-full mt-10 mb-10 sm:p-6">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Jogos Salvos da Lotofácil</h2>
        <ul className="mt-5">
          {jogosSalvos.map((jogo, index) => (
            <li key={index} className="mb-4">
              <h3 className="text-lg font-semibold">Concurso: {jogo[0]}</h3>
              <ul className="mt-2 grid grid-cols-5 gap-1">
                {jogo.slice(1).map((numero, i) => (
                  <li key={i} className="flex items-center justify-center bg-purple-600 text-white rounded-full h-12 w-12 text-xl m-1 shadow-lg">
                    {numero}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyGame;
