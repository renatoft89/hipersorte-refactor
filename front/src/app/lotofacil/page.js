"use client";

import React, { useState } from 'react';

const Lotofacil = () => {
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(15);
  const [numerosGerados, setNumerosGerados] = useState([]);

  const gerarNumeros = () => {
    const numeros = [];

    while (numeros.length < quantidadeNumeros) {
      const numeroAleatorio = Math.floor(Math.random() * 25) + 1; // 1 a 25
      if (!numeros.includes(numeroAleatorio)) {
        numeros.push(numeroAleatorio);
      }
    }

    numeros.sort((a, b) => a - b); // Ordenar em ordem crescente
    setNumerosGerados(numeros);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-20 rounded-lg shadow-lg max-w-lg w-full mt-10 mb-10 sm:p-6">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Gerador da Lotofácil</h2>
        <label className="block text-center mb-5">
          <span className="text-gray-700 text-lg mb-1 block sm:text-sm">Selecione quantos números deseja gerar:</span>
          <input
            type="number"
            min="15"
            max="20"
            value={quantidadeNumeros}
            onChange={(e) => setQuantidadeNumeros(parseInt(e.target.value))}
            className="w-16 p-2 text-lg border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 sm:w-12 sm:text-base"
          />
        </label>
        <button
          className="w-full bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-500 transition duration-300 text-lg sm:py-1 sm:text-base"
          onClick={gerarNumeros}
        >
          Gerar Números
        </button>
        <div className="mt-5">
          <h3 className="text-lg font-semibold">Números Gerados:</h3>
          <ul className="mt-2 flex flex-wrap justify-center">
            {numerosGerados.map((numero, index) => (
              <li 
                key={index} 
                className="flex items-center justify-center bg-purple-600 text-white rounded-full h-20 w-20 text-3xl m-2 shadow-lg transition-transform transform hover:scale-110 hover:shadow-xl duration-300"
              >
                {numero}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Lotofacil;