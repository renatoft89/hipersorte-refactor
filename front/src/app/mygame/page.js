"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GetDrawResults, getSavedUserBets } from '../../services/requests';
import confetti from 'canvas-confetti';

// ===================================================================
// FUNÇÕES UTILITÁRIAS E DE CONFIGURAÇÃO
// ===================================================================

const LOTERIAS_CONFIG = {
  mega: { nome: 'Mega-Sena', cor: 'emerald', premioMin: 6 },
  lotofacil: { nome: 'Lotofácil', cor: 'purple', premioMin: 15 },
  quina: { nome: 'Quina', cor: 'blue', premioMin: 5 }
};

const triggerFireworks = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

// ===================================================================
// SUB-COMPONENTES REUTILIZÁVEIS E ESTILIZADOS
// ===================================================================

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
    <p className="ml-4 text-slate-600 font-semibold">Carregando...</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-6" role="alert">
    <p className="font-bold">Ocorreu um erro</p>
    <p>{message}</p>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-10 px-4 bg-slate-100 rounded-lg mt-6">
    <p className="text-slate-600 font-medium">{message}</p>
  </div>
);

const GameCard = ({ jogo, acertos, loteria }) => {
  const config = LOTERIAS_CONFIG[loteria];
  const isPremiado = acertos.length >= config.premioMin;

  const corBase = `bg-${config.cor}-600`;
  const corAcerto = `bg-emerald-500`;
  
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md transition-all duration-300 ${isPremiado ? 'ring-4 ring-amber-400 shadow-amber-300/50 transform scale-105' : 'hover:shadow-lg'}`}>
      <h3 className="text-lg font-bold text-slate-800">Concurso: {jogo[0]}</h3>
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {jogo.slice(1).map((numero, i) => (
          <div
            key={i}
            className={`flex items-center justify-center rounded-full h-10 w-10 text-lg font-bold text-white shadow-sm transition-all duration-300
              ${acertos.includes(numero) ? `${corAcerto} border-2 border-emerald-300 transform scale-110` : corBase}`
            }
          >
            {String(numero).padStart(2, '0')}
          </div>
        ))}
      </div>
      <div className="text-center mt-4 pt-3 border-t border-slate-200">
        <p className="font-semibold text-slate-700">
          Acertos: 
          <span className={`ml-2 text-xl font-extrabold ${isPremiado ? 'text-amber-500 animate-pulse' : 'text-slate-800'}`}>
            {acertos.length}
          </span>
        </p>
        {isPremiado && (
          <p className="font-bold text-amber-600 mt-2 animate-bounce">
            🎉 Parabéns, jogo premiado! 🎉
          </p>
        )}
      </div>
    </div>
  );
};

// ===================================================================
// COMPONENTE PRINCIPAL MyGame
// ===================================================================

const MyGame = () => {
  const router = useRouter();
  const [jogosSalvos, setJogosSalvos] = useState([]);
  const [resultadosSorteios, setResultadosSorteios] = useState([]);
  const [acertosPorJogo, setAcertosPorJogo] = useState([]);
  const [loteriaSelecionada, setLoteriaSelecionada] = useState('mega');
  const [concursoSelecionado, setConcursoSelecionado] = useState('');
  const [concursosDisponiveis, setConcursosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthAndGetData = useCallback(async () => {
    const userString = localStorage.getItem('USER');
    if (!userString) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (!user?.id) throw new Error("Usuário inválido");
      
      setLoading(true);
      setError(null);
      setAcertosPorJogo([]);
      setConcursoSelecionado('');

      // Busca assíncrona em paralelo
      const [resultadosData, jogosSalvosData] = await Promise.all([
        GetDrawResults('drawresults', loteriaSelecionada),
        getSavedUserBets(`usergames/${user.id}`, loteriaSelecionada)
      ]);
      
      setResultadosSorteios(resultadosData);
      const concursos = [...new Set(resultadosData.map(c => c[0]))].sort((a, b) => b - a);
      setConcursosDisponiveis(concursos);
      
      const jogosFormatados = (jogosSalvosData || [])
        .filter(jogo => Array.isArray(jogo))
        .map(jogo => jogo.map(String));
      setJogosSalvos(jogosFormatados);

    } catch (err) {
      if (err.response?.status === 401 || err.message === "Usuário inválido") {
        router.push('/login');
      } else {
        setError('Erro ao buscar seus dados. Tente novamente mais tarde.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [loteriaSelecionada, router]);

  useEffect(() => {
    checkAuthAndGetData();
  }, [checkAuthAndGetData]);

  useEffect(() => {
    if (!jogosSalvos.length || !resultadosSorteios.length || !concursoSelecionado) {
      setAcertosPorJogo([]);
      return;
    }

    const resultadoAtual = resultadosSorteios.find(c => String(c[0]) === concursoSelecionado) || [];
    if (!resultadoAtual.length) return;

    const numerosSorteados = resultadoAtual.slice(1).map(String);
    const novosAcertos = jogosSalvos
      .filter(jogo => jogo[0] === concursoSelecionado)
      .map(jogo => ({
        jogo,
        acertos: jogo.slice(1).filter(numero => numerosSorteados.includes(numero))
      }));

    setAcertosPorJogo(novosAcertos);

    const algumPremiado = novosAcertos.some(j => j.acertos.length >= LOTERIAS_CONFIG[loteriaSelecionada].premioMin);
    if (algumPremiado) {
      triggerFireworks();
    }
  }, [jogosSalvos, resultadosSorteios, concursoSelecionado, loteriaSelecionada]);

  return (
    <div className="flex justify-center min-h-screen bg-slate-100 font-sans p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-7xl my-10 border border-slate-200/80">
        
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Meus Jogos Salvos</h2>
            <p className="text-slate-500 mt-2">Confira seus acertos nos concursos anteriores.</p>
        </div>

        {/* --- Controles de Seleção --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <label htmlFor="loteria" className="block text-sm font-medium text-slate-600 mb-1">Loteria:</label>
            <select
              id="loteria"
              value={loteriaSelecionada}
              onChange={(e) => setLoteriaSelecionada(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              {Object.entries(LOTERIAS_CONFIG).map(([key, { nome }]) => (
                <option key={key} value={key}>{nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="concurso" className="block text-sm font-medium text-slate-600 mb-1">Concurso:</label>
            <select
              id="concurso"
              value={concursoSelecionado}
              onChange={(e) => setConcursoSelecionado(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              disabled={loading || !concursosDisponiveis.length}
            >
              <option value="">Selecione um concurso</option>
              {concursosDisponiveis.map(numero => (
                <option key={numero} value={numero}>Concurso {numero}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Área de Exibição dos Resultados --- */}
        <div className="min-h-[20rem]">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : !concursoSelecionado ? (
             <EmptyState message="Selecione um concurso para conferir seus jogos." />
          ) : acertosPorJogo.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {acertosPorJogo.map((item, index) => (
                <GameCard key={index} {...item} loteria={loteriaSelecionada} />
              ))}
            </div>
          ) : (
            <EmptyState message={`Você não possui jogos salvos para o concurso ${concursoSelecionado} desta loteria.`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGame;