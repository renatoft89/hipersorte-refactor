import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-sky-600 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-lg font-bold">Hipersorte</h2>
            <p className="text-sm">© {new Date().getFullYear()} Todos os direitos reservados.</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
