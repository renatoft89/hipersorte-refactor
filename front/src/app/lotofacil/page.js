"use client";

import React, { useState, useEffect } from 'react';
import { getNextContest, saveUserLotteryBet } from '../../services/requests'; // Função para buscar o próximo concurso

const Lotofacil = () => {
  const [generatedNumbers, setGeneratedNumbers] = useState([]); // Números gerados
  const [chosenNumbers, setChosenNumbers] = useState([]); // Números escolhidos
  const [savedMessage, setSavedMessage] = useState(""); // Mensagem de sucesso ao salvar
  const [errorMessage, setErrorMessage] = useState(""); // Mensagem de erro
  const [isChoosingMode, setIsChoosingMode] = useState(false); // Modo de escolha de números
  const [numberQuantity, setNumberQuantity] = useState(15); // Quantidade de números
  const [isLoading, setIsLoading] = useState(false); // Estado para controle de loading
  const [nextContest, setNextContest] = useState(""); // Estado para o próximo concurso

  // useEffect para buscar o próximo concurso ao carregar a página
  useEffect(() => {
    // Função assíncrona para buscar o próximo concurso
    const fetchNextContest = async () => {
      try {
        // Chama a função getNextContest para fazer a requisição à API
        const currentContest  = await getNextContest('/contest', 'lotofacil');
               
        setNextContest(currentContest); // Atualiza o estado com o próximo concurso
      } catch (error) {
        console.error("Erro ao buscar o próximo concurso:", error);
      }
    };

    // Chama a função fetchNextContest para buscar o próximo concurso assim que o componente for montado
    fetchNextContest();
  }, []); // O array vazio [] garante que o efeito seja executado apenas uma vez no carregamento inicial do componente

  const generateNumbers = () => {
    setIsLoading(true); // Ativa o loading
    setErrorMessage(""); // Limpa mensagem de erro
    setChosenNumbers([]); // Limpa os números escolhidos
    setSavedMessage(""); // Limpa a mensagem de sucesso

    setTimeout(() => {
      const numbers = new Set();
      while (numbers.size < numberQuantity) {
        const randomNumber = Math.floor(Math.random() * 25) + 1;
        numbers.add(randomNumber);
      }

      const numbersArray = Array.from(numbers);
      numbersArray.sort((a, b) => a - b);

      setGeneratedNumbers(numbersArray); // Atualiza os números gerados
      setIsLoading(false); // Desativa o loading após o tempo
    }, 300); // Atraso de 0,3 segundos para simular o loading
  };

  const selectNumber = (number) => {
    if (chosenNumbers.includes(number)) {
      setChosenNumbers(chosenNumbers.filter(num => num !== number)); // Remove número escolhido
    } else if (chosenNumbers.length < 20) {
      setChosenNumbers([...chosenNumbers, number]); // Adiciona número escolhido
      if (chosenNumbers.length >= 14) {
        setErrorMessage(""); // Limpa a mensagem de erro quando a quantidade mínima é atingida
      }
    }

    if (chosenNumbers.length >= 20) {
      setErrorMessage("You have already chosen the maximum number of numbers!"); // Mensagem de erro para quantidade máxima
    }
  };

  const saveToLocal = async () => {
    const existingData = JSON.parse(localStorage.getItem('resultadosLotofacil')) || []; // Dados existentes no localStorage
    const numbersToSave = isChoosingMode ? [...chosenNumbers] : [...generatedNumbers]; // Escolhe entre os números escolhidos ou gerados
    const sortedGeneratedNumbers = numbersToSave.sort((a, b) => a - b); // Ordena os números gerados
  
    // Verifica se o jogo já está salvo (agora com a comparação correta)
    const existingGame = existingData.find(game => 
      game.slice(1).sort((a, b) => a - b).toString() === sortedGeneratedNumbers.toString() // Compara os números gerados sem o concurso
    );
  
    if (existingGame) {
      // Exibe o alerta somente quando o jogo já existe
      alert("Este jogo já foi salvo, crie um novo jogo");
      return; // Retorna antes de salvar para evitar sobrescrever
    }
  
    // Salva os números junto com o concurso, sem sobrescrever os dados existentes
    existingData.push([nextContest, ...sortedGeneratedNumbers]);
    localStorage.setItem('resultadosLotofacil', JSON.stringify(existingData)); // Salva no localStorage
  
    // Chama a função para salvar a aposta no servidor
    const userId = 1; // Fixo por enquanto
    const lotteryType = 'lotofacil'; // Tipo da loteria
    const betData = [nextContest, ...sortedGeneratedNumbers]; // Dados da aposta
  
    try {
      await saveUserLotteryBet(userId, lotteryType, betData); // Chama a função para salvar a aposta
      setSavedMessage("Jogo salvo com sucesso!"); // Mensagem de sucesso ao salvar
      setTimeout(() => setSavedMessage(""), 8000); // Limpa a mensagem de sucesso após 8 segundos
    } catch (error) {
      console.error("Erro ao salvar a aposta:", error);
      alert("Erro ao salvar a aposta. Tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-20 rounded-lg shadow-lg max-w-lg w-full mt-10 mb-10 sm:p-6">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Gerador da Lotofácil</h2>

        {/* Próximo Concurso */}
        <div className="text-center mb-5">
          <a className="text-gray-700 text-sm sm:text-base font-semibold">
            Próximo Concurso: <span className="text-lg font-bold text-purple-700">{nextContest}</span>
          </a>
        </div>

        {/* Modo de escolha de números */}
        <label className="flex items-center mb-5">
          <input 
            type="checkbox" 
            checked={isChoosingMode} 
            onChange={() => setIsChoosingMode(!isChoosingMode)} 
            className="mr-2"
          />
          <span className="text-gray-700 text-lg">Escolher Números</span>
        </label>

        {isChoosingMode ? (
          <div>
            <div className="text-center mb-5">
              <h3 className="text-lg font-semibold">Números Escolhidos: {chosenNumbers.length}/20</h3>
              {chosenNumbers.length < 15 && <span className="text-red-500">Escolha pelo menos 15 números!</span>}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }, (_, index) => index + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => selectNumber(number)}
                  className={`h-20 w-20 rounded-full text-3xl font-bold m-2 transition duration-300 
                    ${chosenNumbers.includes(number) ? 'bg-green-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-center mb-5">
              <span className="text-gray-700 text-lg mb-1 block sm:text-sm">Selecione quantos números deseja gerar:</span>
              <select 
                value={numberQuantity}
                onChange={(e) => setNumberQuantity(parseInt(e.target.value))}
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
              onClick={generateNumbers}
              disabled={isLoading} // Desabilita o botão enquanto está carregando
            >
              {isLoading ? "Carregando..." : "Gerar Números"}
            </button>

            <div className="mt-5">
              <h3 className="text-lg font-semibold">Números Gerados:</h3>
              <ul className="mt-2 flex flex-wrap justify-center">
                {generatedNumbers.map((number, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-center bg-purple-600 text-white rounded-full h-20 w-20 text-3xl m-2 shadow-lg transition-transform transform hover:scale-110 hover:shadow-xl duration-300"
                  >
                    {number}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {(isChoosingMode && chosenNumbers.length >= 15) || (!isChoosingMode && generatedNumbers.length >= 15) ? (
          <div>
            <button
              className="w-full bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-500 transition duration-300 mt-5"
              onClick={saveToLocal}
            >
              Salvar Jogo
            </button>
            {savedMessage && (
              <p className="mt-2 text-purple-600 font-semibold text-center">{savedMessage}</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Lotofacil;
