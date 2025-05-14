"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNextContest, saveUserLotteryBet } from '../../services/requests';

const Lotofacil = () => {
  const router = useRouter();
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [chosenNumbers, setChosenNumbers] = useState([]);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChoosingMode, setIsChoosingMode] = useState(false);
  const [numberQuantity, setNumberQuantity] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [nextContest, setNextContest] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  // Busca o próximo concurso
  useEffect(() => {
    const fetchNextContest = async () => {
      try {
        const currentContest = await getNextContest('/contest', 'lotofacil');
        setNextContest(currentContest);
      } catch (error) {
        console.error("Erro ao buscar o próximo concurso:", error);
      }
    };

    fetchNextContest();
  }, []);

  const generateNumbers = () => {
    setIsLoading(true);
    setErrorMessage("");
    setChosenNumbers([]);
    setSavedMessage("");

    setTimeout(() => {
      const numbers = new Set();
      while (numbers.size < numberQuantity) {
        const randomNumber = Math.floor(Math.random() * 25) + 1;
        numbers.add(randomNumber);
      }

      const numbersArray = Array.from(numbers).sort((a, b) => a - b);
      setGeneratedNumbers(numbersArray);
      setIsLoading(false);
    }, 300);
  };

  const selectNumber = (number) => {
    if (chosenNumbers.includes(number)) {
      setChosenNumbers(chosenNumbers.filter(num => num !== number));
    } else if (chosenNumbers.length < 20) {
      setChosenNumbers([...chosenNumbers, number]);
      if (chosenNumbers.length >= 14) {
        setErrorMessage("");
      }
    }

    if (chosenNumbers.length >= 20) {
      setErrorMessage("Você já escolheu a quantidade máxima de números!");
    }
  };

  const saveToLocal = async () => {
    try {
      // Verifica autenticação
      const userData = localStorage.getItem('USER');
      if (!userData) {
        setErrorMessage("Você precisa estar logado para salvar. Redirecionando para login...");
        setRedirecting(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        router.push('/login');
        return;
      }

      // Parse dos dados do usuário
      let user;
      try {
        user = JSON.parse(userData);
      } catch (parseError) {
        console.error('Erro ao parsear dados do usuário:', parseError);
        setErrorMessage("Dados inválidos. Redirecionando para login...");
        setRedirecting(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        router.push('/login');
        return;
      }

      // Verifica ID do usuário
      if (!user?.id) {
        setErrorMessage("Sessão inválida. Redirecionando para login...");
        setRedirecting(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        router.push('/login');
        return;
      }

      const existingData = JSON.parse(localStorage.getItem('resultadosLotofacil')) || [];
      const numbersToSave = isChoosingMode ? [...chosenNumbers] : [...generatedNumbers];
      const sortedGeneratedNumbers = numbersToSave.sort((a, b) => a - b);

      const existingGame = existingData.find(game => 
        game.slice(1).sort((a, b) => a - b).toString() === sortedGeneratedNumbers.toString()
      );

      if (existingGame) {
        alert("Este jogo já foi salvo, crie um novo jogo");
        return;
      }

      existingData.push([nextContest, ...sortedGeneratedNumbers]);
      localStorage.setItem('resultadosLotofacil', JSON.stringify(existingData));

      const userId = user.id;
      const lotteryType = 'lotofacil';
      const betData = [nextContest, ...sortedGeneratedNumbers];

      await saveUserLotteryBet(userId, lotteryType, betData);
      setSavedMessage("Jogo salvo com sucesso!");
      setTimeout(() => setSavedMessage(""), 8000);
      
    } catch (error) {
      console.error("Erro ao salvar a aposta:", error);
      
      if (error.response?.status === 401 || error.message.includes('autenticado') || error.message.includes('login')) {
        setErrorMessage("Sessão expirada. Redirecionando para login...");
        setRedirecting(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        router.push('/login');
      } else {
        setErrorMessage("Erro ao salvar o jogo. Tente novamente.");
      }
    } finally {
      setRedirecting(false);
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
              disabled={isLoading}
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
              disabled={redirecting}
            >
              {redirecting ? 'Redirecionando...' : 'Salvar Jogo'}
            </button>
            {savedMessage && (
              <p className="mt-2 text-purple-600 font-semibold text-center">{savedMessage}</p>
            )}
            {errorMessage && (
              <p className="mt-2 text-red-500 font-semibold text-center">{errorMessage}</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Lotofacil;