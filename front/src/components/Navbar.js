'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// Ícones SVG como componentes internos para um JSX mais limpo
const MenuIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const UserIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // Efeito para fechar o dropdown do usuário ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efeito para verificar o login e fechar o menu móvel em mudança de rota
  useEffect(() => {
    const checkUserLoggedIn = () => {
      const userJSON = localStorage.getItem('USER');
      if (userJSON) {
        try {
          const user = JSON.parse(userJSON);
          setUserName(user?.name || 'Usuário');
        } catch (e) {
          setUserName(null);
          localStorage.removeItem('USER');
        }
      } else {
        setUserName(null);
      }
    };

    checkUserLoggedIn();
    setMobileMenuOpen(false); // Fecha o menu móvel sempre que a rota muda
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('USER');
    setUserName(null);
    setDropdownOpen(false);
    router.push('/login');
  };

  // Centraliza os links para fácil manutenção e reutilização
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/mega', label: 'Mega-Sena' },
    { href: '/lotofacil', label: 'Lotofácil' },
    { href: '/quina', label: 'Quina' },
    { href: '/mygames', label: 'Meus Jogos' } // Adicionado link para a página de jogos do usuário
  ];
  
  // Componente de link interno para evitar repetição da lógica de estilo
  const NavLink = ({ href, children, isMobile = false }) => {
    const isActive = pathname === href;
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const mobileClasses = isMobile ? "block" : "inline-block";
    const activeClasses = isActive ? 'bg-sky-700 text-white' : 'text-slate-200 hover:bg-sky-500 hover:text-white';
    
    return (
      <Link href={href} className={`${baseClasses} ${mobileClasses} ${activeClasses}`}>
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-sky-600 shadow-lg sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-40 items-center justify-between">
          
          {/* Logo e Links Desktop */}
          <div className="flex items-center">
            <Link href="/" className="text-white font-extrabold text-xl flex-shrink-0 mr-10 tracking-tight">
              Hypersorte
            </Link>
            <div className="hidden md:flex md:space-x-4">
              {navLinks.map(link => (
                <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
              ))}
            </div>
          </div>

          {/* Menu do Usuário (Desktop) e Botão de Login */}
          <div className="hidden md:flex items-center">
            {userName ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-slate-100 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-600 focus:ring-white"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="font-semibold">Olá, {userName}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink href="/login">Login</NavLink>
            )}
          </div>
          
          {/* Botão do Menu Móvel */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-200 hover:bg-sky-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMobileMenuOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Painel do Menu Móvel */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map(link => (
              <NavLink key={link.href} href={link.href} isMobile={true}>{link.label}</NavLink>
            ))}
            
            <div className="border-t border-sky-700 pt-4 mt-3">
              {userName ? (
                  <div className="flex items-center px-3">
                      <UserIcon className="h-10 w-10 text-slate-200 flex-shrink-0" />
                      <div className="ml-3">
                          <div className="text-base font-semibold text-white">{userName}</div>
                          <button onClick={handleLogout} className="text-sm font-medium text-slate-300 hover:text-white">
                              Logout
                          </button>
                      </div>
                  </div>
              ) : (
                  <NavLink href="/login" isMobile={true}>Login</NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;