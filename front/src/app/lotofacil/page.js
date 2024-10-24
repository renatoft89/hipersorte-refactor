"use client";

import React, { useState } from 'react';

const Lotofacil = () => {
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(15);
  const [numerosGerados, setNumerosGerados] = useState([]);
  const concursoLoto = 2236; // Identificador do concurso

  const [buttonSave, setButtonSave] = useState(true)

  const frequenciaNumeros = [
    { numero: 1, frequencia: 30 },
    { numero: 2, frequencia: 25 },
    { numero: 3, frequencia: 45 },
    { numero: 4, frequencia: 20 },
    { numero: 5, frequencia: 35 },
    { numero: 6, frequencia: 40 },
    { numero: 7, frequencia: 38 },
    { numero: 8, frequencia: 50 },
    { numero: 9, frequencia: 28 },
    { numero: 10, frequencia: 33 },
    { numero: 11, frequencia: 37 },
    { numero: 12, frequencia: 42 },
    { numero: 13, frequencia: 36 },
    { numero: 14, frequencia: 31 },
    { numero: 15, frequencia: 34 },
    { numero: 16, frequencia: 29 },
    { numero: 17, frequencia: 26 },
    { numero: 18, frequencia: 32 },
    { numero: 19, frequencia: 23 },
    { numero: 20, frequencia: 27 },
    { numero: 21, frequencia: 21 },
    { numero: 22, frequencia: 22 },
    { numero: 23, frequencia: 24 },
    { numero: 24, frequencia: 19 },
    { numero: 25, frequencia: 18 },
  ];

  const gerarNumeros = () => {
    const numeros = [];
    const totalFrequencia = frequenciaNumeros.reduce((total, num) => total + num.frequencia, 0);

    while (numeros.length < quantidadeNumeros) {
      const rand = Math.random() * totalFrequencia;
      let somaFrequencia = 0;
      for (let i = 0; i < frequenciaNumeros.length; i++) {
        somaFrequencia += frequenciaNumeros[i].frequencia;
        if (rand <= somaFrequencia && !numeros.includes(frequenciaNumeros[i].numero)) {
          numeros.push(frequenciaNumeros[i].numero);
          break;
        }
      }
    }

    if (numeros.length === quantidadeNumeros) {
      const numerosBaixos = numeros.filter(num => num <= 12);
      const numerosAltos = numeros.filter(num => num > 12);
      if (numerosBaixos.length < 5) {
        const complemento = [...Array(5 - numerosBaixos.length)].map(() => Math.floor(Math.random() * 12) + 1);
        numeros.push(...complemento.filter(num => !numeros.includes(num)));
      }
      if (numerosAltos.length < 5) {
        const complemento = [...Array(5 - numerosAltos.length)].map(() => Math.floor(Math.random() * 13) + 13);
        numeros.push(...complemento.filter(num => !numeros.includes(num)));
      }
    }

    numeros.sort((a, b) => a - b);
    setNumerosGerados(numeros);
    setButtonSave(false)
  };

  const saveToLocal = () => {
    const dadosExistentes = JSON.parse(localStorage.getItem('resultadosLotofacil')) || [];
    
    // Verifica se o jogo já está salvo
    const jogoExistente = dadosExistentes.find(jogo => 
      jogo.slice(1).sort().toString() === numerosGerados.sort().toString()
    );

    if (jogoExistente) {
      alert("O jogo já está salvo, crie um novo jogo");
      return;
    }

    // Adiciona o concurso e os números gerados ao array
    dadosExistentes.push([concursoLoto, ...numerosGerados]);

    localStorage.setItem('resultadosLotofacil', JSON.stringify(dadosExistentes));
    // alert('Números salvos com sucesso!');
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
        {
          buttonSave ? null : (
            <button
              className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-500 transition duration-300 mt-5"
              onClick={saveToLocal}
            >
              Salvar Números
            </button>
          )
        }
      </div>
    </div>
  );
};

export default Lotofacil;
