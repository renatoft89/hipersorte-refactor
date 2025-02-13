'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Função para verificar se o usuário está logado e atualizar o estado `userName`
  const checkUserLoggedIn = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('USER');
      if (token) {
        const user = JSON.parse(token);
        setUserName(user?.name); // Atualiza o estado com o nome do usuário
      } else {
        setUserName(null); // Se não houver token, define o estado como null
      }
    }
  };

  // Verifica o estado do usuário ao carregar o componente
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Verifica o estado do usuário sempre que a rota mudar
  useEffect(() => {
    checkUserLoggedIn();
  }, [currentPath]);

  const handleLogout = () => {
    localStorage.removeItem('USER');
    setUserName(null); // Limpa o estado do usuário
    router.push('/login');
  };

  return (
    <nav className="container-md min-h-32 bg-sky-600 flex items-center justify-between">
      {/* Menu para dispositivos desktop */}
      <div className="px-8 hidden md:flex">
        <Link href="/" className={`text-slate-200 text-lg pl-4 font-bold ${currentPath === '/' ? 'hidden' : ''}`}>
          Home
        </Link>
        <Link href="/mega" className={`text-slate-200 text-lg pl-4 font-mono ${currentPath === '/mega' ? 'hidden' : 'default-link'}`}>
          Mega-Sena
        </Link>
        <Link href="/lotofacil" className={`text-slate-200 text-lg pl-4 font-mono ${currentPath === '/lotofacil' ? 'hidden' : 'default-link'}`}>
          Lotofácil
        </Link>
        <Link href="/quina" className={`text-slate-200 text-lg pl-4 font-mono ${currentPath === '/quina' ? 'hidden' : 'default-link'}`}>
          Quina
        </Link>
      </div>

      {/* Botão de Menu Hamburguer (apenas visível em dispositivos móveis) */}
      <div className="md:hidden flex items-center px-4">
        <button
          className="text-slate-200"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {/* Icone de Menu Hambúrguer usando Tailwind CSS */}
          <div className="space-y-2">
            <div className="w-6 h-1 bg-slate-200"></div>
            <div className="w-6 h-1 bg-slate-200"></div>
            <div className="w-6 h-1 bg-slate-200"></div>
          </div>
        </button>
      </div>

      {/* Menu para dispositivos móveis */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} absolute top-0 left-0 w-full bg-sky-600 p-8`}>
        <Link href="/" className={`text-slate-200 text-lg pl-4 font-bold ${currentPath === '/' ? 'hidden' : ''}`} onClick={() => setMobileMenuOpen(false)}>
          Home
        </Link>
        <Link href="/mega" className={`text-slate-200 text-lg pl-4 font-mono ${currentPath === '/mega' ? 'hidden' : 'default-link'}`} onClick={() => setMobileMenuOpen(false)}>
          Mega-Sena
        </Link>
        <Link href="/lotofacil" className={`text-slate-200 text-lg pl-4 font-mono ${currentPath === '/lotofacil' ? 'hidden' : 'default-link'}`} onClick={() => setMobileMenuOpen(false)}>
          Lotofácil
        </Link>
        <Link href="/quina" className={`text-slate-200 text-lg pl-4 font-mono ${currentPath === '/quina' ? 'hidden' : 'default-link'}`} onClick={() => setMobileMenuOpen(false)}>
          Quina
        </Link>
      </div>

      {/* Menu de Usuário */}
      <div className="p-8 mr-6">
        {userName ? (
          <div className='user-menu'>
            <button
              className='text-slate-50 font-mono'
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <i className="fas fa-user"></i> {/* Ícone de usuário */}
              {`Olá, ${userName}`}
            </button>
            {isDropdownOpen && (
              <div className='text-slate-50 font-mono'>
                <button onClick={handleLogout} className='dropdown-item'>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className={`text-slate-50 text-lg font-mono ${currentPath === '/login' ? 'hover:bg-sky-900' : 'active:bg-sky-700'}`}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;