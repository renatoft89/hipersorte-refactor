'use client';

import React, { useState, useEffect } from 'react';
import { getNextContest, saveUserLotteryBet } from '../../services/requests';

const MegaSena = () => {
  const [numerosGerados, setNumerosGerados] = useState([]);
  const [numerosEscolhidos, setNumerosEscolhidos] = useState([]);
  const [mensagemSalvo, setMensagemSalvo] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [modoEscolha, setModoEscolha] = useState(false);
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(6);
  const [nextContest, setNextContest] = useState();

  // useEffect para buscar o próximo concurso ao carregar a página
  useEffect(() => {
    // Função assíncrona para buscar o próximo concurso
    const fetchNextContest = async () => {
      try {
        // Chama a função getNextContest para fazer a requisição à API
        // A função retorna um objeto contendo o próximo concurso
        const currentContest = await getNextContest('/contest', 'mega');
        // Atualiza o estado 'nextContest' com o valor de currentContest
        // Isso faz com que a interface exiba o próximo concurso ao usuário
        setNextContest(currentContest);
      } catch (error) {
        // Caso ocorra um erro durante a requisição, o erro é capturado e exibido no console
        // Isso ajuda a depurar problemas de comunicação com a API ou outros erros
        console.error("Erro ao buscar o próximo concurso:", error);
      }
    };

    // Chama a função fetchNextContest para buscar o próximo concurso assim que o componente for montado
    // Isso é feito uma única vez, já que o array de dependências do useEffect está vazio
    fetchNextContest();
  }, []); // O array vazio [] garante que o efeito seja executado apenas uma vez no carregamento inicial do componente


  const gerarNumeros = () => {
    const numeros = new Set();
    while (numeros.size < quantidadeNumeros) {
      const numeroAleatorio = Math.floor(Math.random() * 60) + 1; // 1 a 60
      numeros.add(numeroAleatorio);
    }
    const numerosArray = Array.from(numeros).sort((a, b) => a - b);
    setNumerosGerados(numerosArray);
    setNumerosEscolhidos([]);
    setMensagemSalvo("");
    setMensagemErro("");
  };

  const selecionarNumero = (numero) => {
    if (numerosEscolhidos.includes(numero)) {
      setNumerosEscolhidos(numerosEscolhidos.filter(num => num !== numero));
    } else if (numerosEscolhidos.length < 15) {
      setNumerosEscolhidos([...numerosEscolhidos, numero]);
      if (numerosEscolhidos.length >= 5) {
        setMensagemErro(""); // Limpa a mensagem de erro quando a quantidade mínima é atingida
      }
    }
    if (numerosEscolhidos.length >= 15) {
      setMensagemErro("Você já escolheu a quantidade máxima de números!");
    }
  };

  const saveToLocal = async () => {
    const dadosExistentes = JSON.parse(localStorage.getItem('resultadosQuina')) || []; // Dados existentes no localStorage
    const numerosASeremSalvos = modoEscolha ? [...numerosEscolhidos] : [...numerosGerados]; // Escolhe entre os números escolhidos ou gerados
    const numerosGeradosOrdenados = numerosASeremSalvos.sort((a, b) => a - b); // Ordena os números gerados
  
    // Verifica se o jogo já está salvo (agora com a comparação correta)
    const jogoExistente = dadosExistentes.find(jogo =>
      jogo.slice(1).sort((a, b) => a - b).toString() === numerosGeradosOrdenados.toString() // Compara os números gerados sem o concurso
    );
  
    if (jogoExistente) {
      // Exibe o alerta somente quando o jogo já existe
      alert("O jogo já está salvo, crie um novo jogo");
      return; // Retorna antes de salvar para evitar sobrescrever
    }
  
    // Salva os números junto com o concurso, sem sobrescrever os dados existentes
    dadosExistentes.push([nextContest, ...numerosGeradosOrdenados]);
    localStorage.setItem('resultadosQuina', JSON.stringify(dadosExistentes)); // Salva no localStorage
  
    // Chama a função para salvar a aposta no servidor
    const userId = 1; // Fixo por enquanto
    const lotteryType = 'quina'; // Tipo da loteria
    const betData = [nextContest, ...numerosGeradosOrdenados]; // Dados da aposta
  
    try {
      await saveUserLotteryBet(userId, lotteryType, betData); // Chama a função para salvar a aposta
      setMensagemSalvo("Jogo salvo com sucesso!"); // Mensagem de sucesso ao salvar
      setTimeout(() => setMensagemSalvo(""), 8000); // Limpa a mensagem de sucesso após 8 segundos
    } catch (error) {
      console.error("Erro ao salvar a aposta:", error);
      alert("Erro ao salvar a aposta. Tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 p-10 rounded-lg shadow-lg max-w-lg w-full mt-10 mb-10 sm:p-6">
        <h2 className="text-3xl font-bold mb-5 text-center sm:text-xl">Gerador da Mega Sena</h2>

        {/* Próximo Concurso */}
        <div className="text-center mb-5">
          <a className="text-gray-700 text-sm sm:text-base font-semibold">
            Próximo Concurso: <span className="text-lg font-bold text-green-600">{nextContest}</span>
          </a>
        </div>

        <label className="flex items-center mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={modoEscolha}
            onChange={() => setModoEscolha(!modoEscolha)}
            className="mr-2"
          />
          <span className={`text-gray-700 text-lg ${modoEscolha ? 'font-bold' : ''}`}>Escolher Números</span>
        </label>

        {modoEscolha ? (
          <div>
            <div className="text-center mb-5">
              <h3 className="text-lg font-semibold">Números Escolhidos: {numerosEscolhidos.length}/15</h3>
              {numerosEscolhidos.length < 6 && <span className="text-red-500">Escolha pelo menos 6 números!</span>}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 60 }, (_, index) => index + 1).map((numero) => (
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
                {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                  <option key={num} value={num}>{num} Números</option>
                ))}
              </select>
            </label>

            <button
              className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-500 transition duration-300 text-lg sm:py-1 sm:text-base"
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
                    className="flex items-center justify-center bg-green-600 text-white rounded-full h-20 w-20 text-3xl m-2 shadow-lg transition-transform transform hover:scale-110 hover:shadow-xl duration-300"
                  >
                    {numero}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {(modoEscolha && numerosEscolhidos.length >= 6) || (!modoEscolha && numerosGerados.length >= 6) ? (
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

export default MegaSena;
