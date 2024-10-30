"use client";

import React, { useState } from 'react';

const MegaSena = () => {
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(6);
  const [numerosGerados, setNumerosGerados] = useState([]);
  const [mensagemSalvo, setMensagemSalvo] = useState(""); // Estado para mensagem de sucesso
  const concursoLoto = 2792; // Identificador do concurso
  const [buttonSave, setButtonSave] = useState(true);

  const gerarNumeros = () => {
    const numeros = new Set(); // Usar Set para evitar duplicatas

    // Gerar números aleatórios de 1 a 60
    while (numeros.size < quantidadeNumeros) {
      const numeroAleatorio = Math.floor(Math.random() * 60) + 1; // 1 a 60
      numeros.add(numeroAleatorio);
    }

    const numerosArray = Array.from(numeros).sort((a, b) => a - b);
    setNumerosGerados(numerosArray);
    setButtonSave(false);
    setMensagemSalvo(""); // Limpa a mensagem ao gerar novos números
  };

  const saveToLocal = () => {
    const dadosExistentes = JSON.parse(localStorage.getItem('resultadosMegaSena')) || [];
    const numerosGeradosOrdenados = [...numerosGerados].sort((a, b) => a - b);
    const jogoExistente = dadosExistentes.find(jogo => 
      jogo.slice(1).sort((a, b) => a - b).toString() === numerosGeradosOrdenados.toString()
    );

    if (jogoExistente) {
      alert("O jogo já está salvo, crie um novo jogo");
      return;
    }

    dadosExistentes.push([concursoLoto, ...numerosGeradosOrdenados]);
    localStorage.setItem('resultadosMegaSena', JSON.stringify(dadosExistentes));

    // Mensagem de sucesso
    setMensagemSalvo("Jogo salvo com sucesso!");
    setTimeout(() => setMensagemSalvo(""), 3000); // Remove a mensagem após 3 segundos
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-20 rounded-lg shadow-lg max-w-lg w-full mt-10 mb-10 sm:p-6">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Gerador da Mega Sena</h2>
        <label className="block text-center mb-5">
          <span className="text-gray-700 text-lg mb-1 block sm:text-sm">Selecione quantos números deseja gerar:</span>
          <input
            type="number"
            min="6"
            max="15"
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

export default MegaSena;
