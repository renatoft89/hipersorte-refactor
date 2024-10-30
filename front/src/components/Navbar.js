'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('USER');
      if (token) {
        setUserName(JSON.parse(token)?.name);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('USER');
    setUserName(null);
    router.push('/login');
  };

  return (
    <nav className="container-md min-h-32 bg-sky-600 flex items-center justify-between">
      <div className="flex px-8">
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
