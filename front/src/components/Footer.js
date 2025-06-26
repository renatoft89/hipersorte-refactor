import React from 'react';
import Link from 'next/link';

const Footer = () => {
  // Centralizando os links para fácil manutenção, espelhando a Navbar
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/mega', label: 'Mega-Sena' },
    { href: '/lotofacil', label: 'Lotofácil' },
    { href: '/quina', label: 'Quina' },
    { href: '/mygames', label: 'Meus Jogos' }
  ];

  return (
    <footer className="bg-sky-700 text-slate-300 mt-auto border-t border-slate-700/50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Layout em grid para as seções principais do rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Seção 1: Marca e Tagline */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Hypersorte</h2>
            <p className="mt-2 text-sm text-slate-400">
              Sua plataforma de análise e geração de jogos para as principais loterias.
            </p>
          </div>

          {/* Seção 2: Navegação Rápida */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-base font-semibold text-white">Navegação</h3>
              <ul className="mt-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Seção 3: Legal/Recursos (pode ser expandida no futuro) */}
            <div>
              <h3 className="text-base font-semibold text-white">Recursos</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  {/* Exemplo de link futuro */}
                  <a href="#" className="text-sm text-slate-400 cursor-not-allowed">Termos de Uso</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 cursor-not-allowed">Política de Privacidade</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Linha divisória e seção de Copyright/Disclaimer */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="text-center md:text-left">
            {/* Disclaimer de Jogo Responsável - Essencial para este tipo de site */}
            <p className="text-xs text-slate-400 mb-2">
              <strong>AVISO:</strong> Este site não realiza apostas nem se vincula a nenhuma entidade lotérica. 
              As ferramentas são fornecidas apenas para análise e entretenimento. Jogue com responsabilidade.
            </p>
            <p className="text-xs text-slate-500">
              Serviço destinado a maiores de 18 anos.
            </p>
            <p className="text-sm text-slate-400 mt-4">
              © {new Date().getFullYear()} Hypersorte. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;