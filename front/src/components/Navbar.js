'use client'

import React from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

const Navbar = (() => {
  const router = useRouter();
  const currentPath = router.asPath;
  return (
    <nav className="container-md min-h-32 bg-sky-600 flex items-center justify-between ">
      <div className="flex px-8">
        <Link href="/" className={`text-slate-200 pl-4 font-bold ${currentPath === '/' ? 'disabled-link' : 'active-link'}`}>
          Home
        </Link>
        <Link href="/mega" className={`text-slate-200  pl-4 font-mono ${router.pathname === '/mega' ? 'active-link' : 'default-link'}`}>
          Mega-Sena
        </Link>
        <Link href="/lotofacil" className={`text-slate-200  pl-4 font-mono ${router.pathname === '/lotofacil' ? 'active-link' : 'default-link'}`}>
          Lotofácil
        </Link>
        <Link href="/quina" className={`text-slate-200 pl-4 font-mono ${router.pathname === '/quina' ? 'active-link' : 'default-link'}`}>
          Quina
        </Link>
      </div>
      <div className="p-8 mr-6">
        <Link href="#" className="text-slate-50 font-mono">User</Link>
      </div>
    </nav>
  );
});


export default Navbar;