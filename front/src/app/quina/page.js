"use client";

import React, { useState } from 'react';

const Quina = () => {
  const [numerosGerados, setNumerosGerados] = useState([]);
  const [numerosEscolhidos, setNumerosEscolhidos] = useState([]);
  const [mensagemSalvo, setMensagemSalvo] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const concursoLoto = 6570; 
  const [modoEscolha, setModoEscolha] = useState(false);
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(5);

  const gerarNumeros = () => {
    const numeros = new Set();

    while (numeros.size < quantidadeNumeros) { // Gera a quantidade selecionada
      const numeroAleatorio = Math.floor(Math.random() * 80) + 1; // 1 a 80
      numeros.add(numeroAleatorio);
    }

    const numerosArray = Array.from(numeros).sort((a, b) => a - b);
    setNumerosGerados(numerosArray);
    setNumerosEscolhidos([]); // Limpa os números escolhidos
    setMensagemSalvo("");
    setMensagemErro("");
  };

  const selecionarNumero = (numero) => {
    if (numerosEscolhidos.includes(numero)) {
      setNumerosEscolhidos(numerosEscolhidos.filter(num => num !== numero));
    } else if (numerosEscolhidos.length < 9) { // Máximo de 9 números
      setNumerosEscolhidos([...numerosEscolhidos, numero]);
      if (numerosEscolhidos.length >= 4) {
        setMensagemErro(""); // Limpa a mensagem de erro quando a quantidade mínima é atingida
      }
    }

    if (numerosEscolhidos.length >= 9) {
      setMensagemErro("Você já escolheu a quantidade máxima de números!");
    }
  };

  const saveToLocal = () => {
    const dadosExistentes = JSON.parse(localStorage.getItem('resultadosQuina')) || [];
    const numerosASeremSalvos = modoEscolha ? [...numerosEscolhidos] : [...numerosGerados];
    const numerosGeradosOrdenados = numerosASeremSalvos.sort((a, b) => a - b);

    // Verifica se o jogo já está salvo
    const jogoExistente = dadosExistentes.find(jogo => 
      jogo.slice(1).sort((a, b) => a - b).toString() === numerosGeradosOrdenados.toString()
    );

    if (jogoExistente) {
      alert("O jogo já está salvo, crie um novo jogo");
      return;
    }

    // Salva os números junto com o concurso
    dadosExistentes.push([concursoLoto, ...numerosGeradosOrdenados]);
    localStorage.setItem('resultadosQuina', JSON.stringify(dadosExistentes));

    setMensagemSalvo("Jogo salvo com sucesso!");
    setTimeout(() => setMensagemSalvo(""), 3000);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-10 rounded-lg shadow-lg max-w-lg w-full mt-10 mb-10 sm:p-6">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Gerador da Quina</h2>

        <label className="flex items-center mb-5">
          <input 
            type="checkbox" 
            checked={modoEscolha} 
            onChange={() => setModoEscolha(!modoEscolha)} 
            className="mr-2"
          />
          <span className="text-gray-700 text-lg">Escolher Números</span>
        </label>

        {modoEscolha ? (
          <div>
            <div className="text-center mb-5">
              <h3 className="text-lg font-semibold">Números Escolhidos: {numerosEscolhidos.length}/9</h3>
              {numerosEscolhidos.length < 5 && <span className="text-red-500">Escolha pelo menos 5 números!</span>}
              {mensagemErro && <span className="text-red-500">{mensagemErro}</span>}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 80 }, (_, index) => index + 1).map((numero) => (
                <button
                  key={numero}
                  onClick={() => selecionarNumero(numero)}
                  className={`h-20 w-20 rounded-full text-3xl font-bold m-2 transition duration-300 
                    ${numerosEscolhidos.includes(numero) ? 'bg-[#260085] text-white' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                >
                  {numero}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-center mb-5">
              <span className="text-gray-700 text-lg mb-1 block sm:text-sm">Selecione quantos números deseja gerar:</span>
              <select 
                value={quantidadeNumeros}
                onChange={(e) => setQuantidadeNumeros(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
              >
                {[...Array(5).keys()].map(i => (
                  <option key={i + 5} value={i + 5}>{i + 5} Números</option>
                ))}
              </select>
            </label>

            <button
              className="w-full bg-[#260085] text-white font-bold py-2 rounded hover:bg-purple-700 transition duration-300 text-lg sm:py-1 sm:text-base"
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
                    className="flex items-center justify-center bg-[#260085] text-white rounded-full h-20 w-20 text-3xl m-2 shadow-lg transition-transform transform hover:scale-110 hover:shadow-xl duration-300"
                  >
                    {numero}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {(modoEscolha && numerosEscolhidos.length >= 5) || (!modoEscolha && numerosGerados.length >= 5) ? (
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
        ) : null}
      </div>
    </div>
  );
};

export default Quina;
