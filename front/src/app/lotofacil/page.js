"use client";

import React, { useState } from 'react';

const Lotofacil = () => {
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(15);
  const [numerosGerados, setNumerosGerados] = useState([]);
  const [mensagemSalvo, setMensagemSalvo] = useState(""); // Estado para mensagem de sucesso
  const concursoLoto = 3231; // Identificador do concurso
  const [buttonSave, setButtonSave] = useState(true);

  // Frequência dos números (exemplo)
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
    const numeros = new Set(); // Usar Set para evitar duplicatas
    const totalFrequencia = frequenciaNumeros.reduce((total, num) => total + num.frequencia, 0);

    // Gerar números com base na frequência
    while (numeros.size < quantidadeNumeros) {
      const rand = Math.random() * totalFrequencia;
      let somaFrequencia = 0;

      for (let { numero, frequencia } of frequenciaNumeros) {
        somaFrequencia += frequencia;
        if (rand <= somaFrequencia) {
          numeros.add(numero); // Adiciona ao Set
          break;
        }
      }
    }

    // Converter Set de volta para Array
    const numerosArray = Array.from(numeros);
    numerosArray.sort((a, b) => a - b);

    // Garantir a distribuição de números baixos e altos
    const numerosBaixos = numerosArray.filter(num => num <= 12);
    const numerosAltos = numerosArray.filter(num => num > 12);

    if (numerosBaixos.length < 5) {
      const complemento = [...Array(5 - numerosBaixos.length)].map(() => {
        let num;
        do {
          num = Math.floor(Math.random() * 12) + 1;
        } while (numerosArray.includes(num)); // Evitar duplicatas
        return num;
      });
      numerosArray.push(...complemento);
    }

    if (numerosAltos.length < 5) {
      const complemento = [...Array(5 - numerosAltos.length)].map(() => {
        let num;
        do {
          num = Math.floor(Math.random() * 13) + 13;
        } while (numerosArray.includes(num)); // Evitar duplicatas
        return num;
      });
      numerosArray.push(...complemento);
    }

    setNumerosGerados(numerosArray);
    setButtonSave(false);
    setMensagemSalvo(""); // Limpa a mensagem ao gerar novos números
  };

  const saveToLocal = () => {
    const dadosExistentes = JSON.parse(localStorage.getItem('resultadosLotofacil')) || [];
    const numerosGeradosOrdenados = [...numerosGerados].sort((a, b) => a - b);
    const jogoExistente = dadosExistentes.find(jogo => 
      jogo.slice(1).sort((a, b) => a - b).toString() === numerosGeradosOrdenados.toString()
    );

    if (jogoExistente) {
      alert("O jogo já está salvo, crie um novo jogo");
      return;
    }

    dadosExistentes.push([concursoLoto, ...numerosGeradosOrdenados]);
    localStorage.setItem('resultadosLotofacil', JSON.stringify(dadosExistentes));

    // Mensagem de sucesso
    setMensagemSalvo("Jogo salvo com sucesso!");
    setTimeout(() => setMensagemSalvo(""), 3000); // Remove a mensagem após 3 segundos
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
        {buttonSave ? null : (
          <div>
            <button
              className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-500 transition duration-300 mt-5"
              onClick={saveToLocal}
            >
              Salvar Jogo
            </button>
            {mensagemSalvo && (
              <p className="mt-2 text-green-600 font-semibold text-center">{mensagemSalvo}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lotofacil;
