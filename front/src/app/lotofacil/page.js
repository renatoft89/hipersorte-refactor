"use client";

import React, { useState } from 'react';

const Lotofacil = () => {
  const [numerosGerados, setNumerosGerados] = useState([]);
  const [numerosEscolhidos, setNumerosEscolhidos] = useState([]);
  const [mensagemSalvo, setMensagemSalvo] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const concursoLoto = 3231; 
  const [buttonSave, setButtonSave] = useState(true);
  const [modoEscolha, setModoEscolha] = useState(false);
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(15);
  const [isLoading, setIsLoading] = useState(false); // Estado para controle de loading

  const gerarNumeros = () => {
    setIsLoading(true); // Ativa o loading
    setMensagemErro("");
    setNumerosEscolhidos([]);
    setMensagemSalvo("");

    setTimeout(() => {
      const numeros = new Set();
      while (numeros.size < quantidadeNumeros) {
        const numeroAleatorio = Math.floor(Math.random() * 25) + 1;
        numeros.add(numeroAleatorio);
      }

      const numerosArray = Array.from(numeros);
      numerosArray.sort((a, b) => a - b);

      setNumerosGerados(numerosArray);
      setButtonSave(false);
      setIsLoading(false); // Desativa o loading após o tempo
    }, 300); // Atraso de 0,3 segundos para simular o loading
  };

  const selecionarNumero = (numero) => {
    if (numerosEscolhidos.includes(numero)) {
      setNumerosEscolhidos(numerosEscolhidos.filter(num => num !== numero));
    } else if (numerosEscolhidos.length < 20) {
      setNumerosEscolhidos([...numerosEscolhidos, numero]);
      if (numerosEscolhidos.length >= 14) {
        setMensagemErro(""); // Limpa a mensagem de erro quando a quantidade mínima é atingida
      }
    }

    if (numerosEscolhidos.length >= 20) {
      setMensagemErro("Você já escolheu a quantidade máxima de números!");
    }
  };

  const saveToLocal = () => {
    const dadosExistentes = JSON.parse(localStorage.getItem('resultadosLotofacil')) || [];
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
    localStorage.setItem('resultadosLotofacil', JSON.stringify(dadosExistentes));

    setMensagemSalvo("Jogo salvo com sucesso!");
    setTimeout(() => setMensagemSalvo(""), 8000);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-20 rounded-lg shadow-lg max-w-lg w-full mt-10 mb-10 sm:p-6">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Gerador da Lotofácil</h2>

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
              <h3 className="text-lg font-semibold">Números Escolhidos: {numerosEscolhidos.length}/20</h3>
              {numerosEscolhidos.length < 15 && <span className="text-red-500">Escolha pelo menos 15 números!</span>}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }, (_, index) => index + 1).map((numero) => (
                <button
                  key={numero}
                  onClick={() => selecionarNumero(numero)}
                  className={`h-20 w-20 rounded-full text-3xl font-bold m-2 transition duration-300 
                    ${numerosEscolhidos.includes(numero) ? 'bg-green-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
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
                <option value={15}>15 Números</option>
                <option value={16}>16 Números</option>
                <option value={17}>17 Números</option>
                <option value={18}>18 Números</option>
                <option value={19}>19 Números</option>
                <option value={20}>20 Números</option>
              </select>
            </label>

            <button
              className="w-full bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-500 transition duration-300 text-lg sm:py-1 sm:text-base"
              onClick={gerarNumeros}
              disabled={isLoading} // Desabilita o botão enquanto está carregando
            >
              {isLoading ? "Carregando..." : "Gerar Números"}
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
        )}

        {(modoEscolha && numerosEscolhidos.length >= 15) || (!modoEscolha && numerosGerados.length >= 15) ? (
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

export default Lotofacil;
