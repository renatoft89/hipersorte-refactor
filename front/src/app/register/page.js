"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { regRegisterUser } from '../../services/requests'; // Função de registro do usuário
import Image from 'next/image';
import Sorte from '../../img/sorte.png';
import useAuth from '@/components/PrivateRoute';

const Register = () => {
  const router = useRouter();
  const isAuthenticated = useAuth(); // Verifica se o usuário já está autenticado

  if (isAuthenticated) {
    router.push('/'); // Redireciona para a página inicial se o usuário estiver logado
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusRegister, setStatusRegister] = useState(""); // Status do registro
  const [loading, setLoading] = useState(false); // Estado para controlar o loading

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleRegistration = async (event) => {
    event.preventDefault();

    // Dados para o backend
    const dataUser = {
      name,
      email,
      password,
      role: 'user', // Role fixo como 'user'
    };

    try {
      setLoading(true);  // Inicia o loading

      // Envia os dados para o backend
      const response = await regRegisterUser('/register/user', dataUser);

      if (response && response.message) {
        setStatusRegister("Usuário registrado com sucesso!");

        // Cria o efeito de loading antes do redirecionamento
        setTimeout(() => {
          setLoading(false); // Finaliza o loading
          // Exibe a mensagem de sucesso por 2 segundos antes de redirecionar
          setTimeout(() => {
            router.push("/login");
          }, 1000); // Redirecionamento após 1 segundos
        }, 2000); // 3 segundos de delay do loading
      } else {
        setStatusRegister("Erro ao obter dados de usuário.");
        setLoading(false);  // Para o loading em caso de erro
      }
    } catch (error) {
      setStatusRegister(error.response?.data?.message || error.message);
      setLoading(false); // Para o loading em caso de erro
    }
  };

  const validateInput = () => {
    const MIN_PASSWORD = 6;
    const MIN_NAME = 3;
    const REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/gm;
    const nameTest = name.length < MIN_NAME;
    const passwordTest = password.length < MIN_PASSWORD;
    const emailTest = !(REGEX.test(email));

    return nameTest || emailTest || passwordTest;
  }

  return (
    <form className="flex justify-center items-center mt-5 p-3">
      <fieldset className="flex flex-col items-center bg-[#0056b312] border-[#93a1ef] rounded-md shadow-lg max-w-96 px-20 py-12">
        <h1 className="font-bradley text-2xl text-center mb-2 text-blue-800">Hypersorte</h1>
        <div className="flex flex-col items-center w-full">
          <Image
            src={Sorte}
            alt="sorte-logo"
            className="max-w-[200px] p-5"
          />
          <label htmlFor='name' className="flex flex-col w-full">
            <span className="text-left mb-1">Nome:</span>
            <input
              type="text"
              className="border-black rounded-md mb-3 p-2 w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={name}
              name="name"
              onChange={handleChange}
            />
            <span className="text-left mb-1">Email:</span>
            <input
              type="email"
              className="border-black rounded-md mb-3 p-2 w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={email}
              name="email"
              onChange={handleChange}
            />
            <span className="text-left mb-1">Senha:</span>
            <input
              className='border-black rounded-md mb-4 p-2 w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-300'
              type="password"
              value={password}
              name='password'
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="flex flex-col space-y-4 w-full">
          {/* Botão de registro */}
          <button
            type="submit"
            onClick={handleRegistration}
            disabled={validateInput() || loading}
            className={`${
              validateInput() || loading ? 
                'bg-blue-200 text-blue-600 opacity-50 cursor-not-allowed' : 
                'bg-blue-600 text-white opacity-100 hover:bg-blue-700'
            } rounded-md h-10 w-[280px]`}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
          
          {/* Botão para login */}
          <button
            type="button"
            className="bg-[#f2fffc] border border-[#0349ff24] rounded-md h-10 w-[280px] text-blue-600 cursor-pointer"
            onClick={() => router.push('/login')}
          >
            Já tenho uma conta
          </button>
          
          {/* Exibição de erro ou sucesso */}
          {!loading && statusRegister && (
            <span className={statusRegister.includes("sucesso") ? "text-green-600" : "text-red-500"}>
              {statusRegister}
            </span>
          )}
          
          {/* Exibição do loading */}
          {loading && (
            <div className="flex justify-center items-center mt-3">
              <div className="spinner-border animate-spin border-t-4 border-blue-600 w-8 h-8 border-solid rounded-full"></div>
            </div>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export default Register;
