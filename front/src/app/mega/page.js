'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getNextContest, saveUserLotteryBet } from '../../services/requests';

// A função utilitária não precisa de alterações
const gerarNumerosEstrategicos = (options) => {
  const defaults = {
    quantidade: 6,
    maxNumero: 60,
    excluir: [],
    incluir: [],
    paridade: null,
  };
  const config = { ...defaults, ...options };

  if (config.incluir.length > config.quantidade) {
    console.error("Erro: A quantidade de números a incluir é maior que a quantidade total.");
    return [];
  }

  const numeros = new Set(config.incluir);
  const excluidos = new Set(config.excluir);

  let tentativas = 0;
  while (numeros.size < config.quantidade && tentativas < 5000) {
    tentativas++;
    const numeroAleatorio = Math.floor(Math.random() * config.maxNumero) + 1;

    if (numeros.has(numeroAleatorio) || excluidos.has(numeroAleatorio)) {
      continue;
    }

    if (config.paridade) {
      const pares = [...numeros].filter(n => n % 2 === 0).length;
      const impares = numeros.size - pares;
      const metade = Math.ceil(config.quantidade / 2);

      if (numeroAleatorio % 2 === 0) {
        if (config.paridade === 'equilibrado' && pares >= metade) continue;
      } else {
        if (config.paridade === 'equilibrado' && impares >= metade) continue;
      }
    }

    numeros.add(numeroAleatorio);
  }

  if (numeros.size < config.quantidade) {
    alert("Atenção: Não foi possível gerar os números com as restrições escolhidas. Um novo jogo aleatório foi gerado.");
    return gerarNumerosEstrategicos({ quantidade: config.quantidade, maxNumero: config.maxNumero });
  }

  return Array.from(numeros).sort((a, b) => a - b);
};


// --- Sub-componentes para uma UI mais limpa ---
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className="block bg-slate-300 w-14 h-8 rounded-full transition-colors duration-300"></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${checked ? 'transform translate-x-6 bg-emerald-500' : ''}`}></div>
    </div>
    <div className="ml-3 text-slate-700 font-medium">
      Escolher Números Manualmente
    </div>
  </label>
);

const NumberGrid = ({ selectedNumbers, onSelectNumber }) => (
  <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-3 bg-slate-100 rounded-lg border border-slate-200">
    {Array.from({ length: 60 }, (_, i) => i + 1).map((numero) => (
      <button
        key={numero}
        onClick={() => onSelectNumber(numero)}
        className={`flex items-center justify-center rounded-full font-bold text-lg aspect-square transition-all duration-200 ease-in-out transform
                    ${selectedNumbers.includes(numero)
                      ? 'bg-emerald-500 text-white shadow-md scale-105'
                      : 'bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-200 hover:border-slate-400'
                    }`}
      >
        {String(numero).padStart(2, '0')}
      </button>
    ))}
  </div>
);

const GeneratedNumbersDisplay = ({ numbers }) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-center text-slate-800">Seu Jogo Gerado:</h3>
    <ul className="mt-4 flex flex-wrap justify-center gap-3">
      {numbers.map((numero, index) => (
        <li key={index} className="flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full font-bold shadow-lg 
                                  h-16 w-16 text-2xl border-2 border-white/50">
          {String(numero).padStart(2, '0')}
        </li>
      ))}
    </ul>
  </div>
);

const AlertMessage = ({ message, type }) => {
    if (!message) return null;
    const baseClasses = "mt-4 p-3 rounded-lg text-center font-semibold text-sm";
    const typeClasses = {
      success: "bg-emerald-100 text-emerald-800",
      error: "bg-red-100 text-red-800",
    };
    return (
      <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
        {message}
      </div>
    );
};


// --- Componente Principal ---
const MegaSena = () => {
  const router = useRouter();
  const [numerosGerados, setNumerosGerados] = useState([]);
  const [numerosEscolhidos, setNumerosEscolhidos] = useState([]);
  const [mensagemSalvo, setMensagemSalvo] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [modoEscolha, setModoEscolha] = useState(false);
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(6);
  const [nextContest, setNextContest] = useState();
  const [redirecionando, setRedirecionando] = useState(false);
  const [estrategia, setEstrategia] = useState('aleatoria');

  useEffect(() => {
    const fetchNextContest = async () => {
      try {
        const currentContest = await getNextContest('/contest', 'mega');
        setNextContest(currentContest);
      } catch (error) {
        console.error("Erro ao buscar o próximo concurso:", error);
      }
    };
    fetchNextContest();
  }, []);
  
  const handleGerarJogo = useCallback(() => {
    const options = {
      quantidade: Number(quantidadeNumeros),
      maxNumero: 60,
    };

    switch (estrategia) {
      case 'equilibrado': options.paridade = 'equilibrado'; break;
      case 'antiAniversario': options.excluir = Array.from({ length: 31 }, (_, i) => i + 1); break;
      case 'fixarDezenas': options.incluir = [10, 53]; options.excluir = [26]; break;
      default: break;
    }

    const numeros = gerarNumerosEstrategicos(options);
    setNumerosGerados(numeros);
    setNumerosEscolhidos([]);
    setMensagemSalvo("");
    setMensagemErro("");
  }, [quantidadeNumeros, estrategia]);

  const selecionarNumero = (numero) => {
    setMensagemErro("");
    setNumerosEscolhidos(prev => {
      if (prev.includes(numero)) {
        return prev.filter(num => num !== numero);
      }
      if (prev.length >= 20) {
        setMensagemErro("Você já escolheu a quantidade máxima de números (20)!");
        return prev;
      }
      return [...prev, numero].sort((a, b) => a - b);
    });
  };

  const saveToLocal = async () => {
    setMensagemErro("");
    setMensagemSalvo("");

    try {
      const userData = localStorage.getItem('USER');
      if (!userData || !JSON.parse(userData)?.id) {
        setMensagemErro("Você precisa estar logado para salvar. Redirecionando para login...");
        setRedirecionando(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);
      const numerosASeremSalvos = modoEscolha ? numerosEscolhidos : numerosGerados;

      if (numerosASeremSalvos.length < 6) {
        setMensagemErro("É necessário ter pelo menos 6 números para salvar.");
        return;
      }

      const dadosExistentes = JSON.parse(localStorage.getItem('resultadosMega')) || [];
      const jogoExistente = dadosExistentes.find(jogo =>
        jogo.slice(1).sort((a, b) => a - b).toString() === [...numerosASeremSalvos].sort((a, b) => a - b).toString()
      );

      if (jogoExistente) {
        throw new Error("Este jogo já foi salvo anteriormente. Gere um novo.");
      }
      
      const betData = [nextContest, ...numerosASeremSalvos.sort((a, b) => a - b)];
      dadosExistentes.push(betData);
      localStorage.setItem('resultadosMega', JSON.stringify(dadosExistentes));
      
      await saveUserLotteryBet(user.id, 'mega', betData);
      setMensagemSalvo("Jogo salvo com sucesso!");
      setTimeout(() => setMensagemSalvo(""), 5000);

    } catch (error) {
      console.error("Erro ao salvar a aposta:", error);
      
      if (error.response?.status === 401 || error.message.includes('autenticado')) {
        setMensagemErro("Sessão expirada. Redirecionando para login...");
        setRedirecionando(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        router.push('/login');
        return;
      } else {
        setMensagemErro(error.message || "Erro ao salvar o jogo. Tente novamente.");
        setRedirecionando(false);
      }
    }
  };
  
  const isSaveButtonEnabled = (modoEscolha && numerosEscolhidos.length >= 6) || (!modoEscolha && numerosGerados.length > 0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-3xl w-full my-10 border border-slate-200/80">
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Gerador Mega-Sena</h2>
            <p className="text-slate-500 mt-2">
                Próximo Concurso: <span className="font-bold text-emerald-600 text-lg">{nextContest || 'Carregando...'}</span>
            </p>
        </div>

        <div className="flex justify-center mb-8">
            <ToggleSwitch checked={modoEscolha} onChange={() => setModoEscolha(!modoEscolha)} />
        </div>

        {modoEscolha ? (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-slate-700">
                Números Escolhidos: <span className="font-bold text-emerald-600">{numerosEscolhidos.length}</span>/20
              </h3>
              {numerosEscolhidos.length > 0 && numerosEscolhidos.length < 6 && 
                <p className="text-sm text-amber-600">Escolha pelo menos 6 números para poder salvar.</p>
              }
            </div>
            <NumberGrid selectedNumbers={numerosEscolhidos} onSelectNumber={selecionarNumero} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="estrategia" className="block text-sm font-medium text-slate-600 mb-1">Estratégia de Geração:</label>
                <select id="estrategia" value={estrategia} onChange={(e) => setEstrategia(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">
                  <option value="aleatoria">Aleatória Simples</option>
                  <option value="equilibrado">Equilíbrio Pares/Ímpares</option>
                  <option value="antiAniversario">Foco em Dezenas Altas</option>
                  <option value="fixarDezenas">Fixar/Excluir Dezenas</option>
                </select>
              </div>
              <div>
                <label htmlFor="quantidade" className="block text-sm font-medium text-slate-600 mb-1">Quantidade de Números:</label>
                <select id="quantidade" value={quantidadeNumeros} onChange={(e) => setQuantidadeNumeros(parseInt(e.target.value))}
                  className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">
                  {Array.from({ length: 15 }, (_, i) => i + 6).map(num => (
                    <option key={num} value={num}>{num} Números</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-500 transition-all duration-300 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              onClick={handleGerarJogo} >
              Gerar Jogo
            </button>
            {numerosGerados.length > 0 && <GeneratedNumbersDisplay numbers={numerosGerados} />}
          </div>
        )}

        <div className="mt-8 border-t border-slate-200 pt-6">
            <button
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                onClick={saveToLocal}
                disabled={!isSaveButtonEnabled || redirecionando} >
                {redirecionando ? 'Redirecionando...' : 'Salvar Jogo'}
            </button>
            <AlertMessage message={mensagemSalvo} type="success" />
            <AlertMessage message={mensagemErro} type="error" />
        </div>
      </div>
    </div>
  );
};

export default MegaSena;