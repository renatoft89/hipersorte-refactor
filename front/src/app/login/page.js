"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addUserLocal } from '../../services/localStorage';
import { authUser } from '../../services/requests';
import Image from 'next/image';
import Sorte from '../../img/sorte.png';
import useAuth from '@/components/PrivateRoute';

const Login = () => {
  const router = useRouter();
  const isAuthenticated = useAuth(); // Verifica se o usuário já está autenticado

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/'); // Redireciona para a página inicial se o usuário estiver logado
    }
  }, [isAuthenticated, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleRegistration = (event) => {
    event.preventDefault();
    router.push('/register');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const dataLogin = { email, password };
  
    try {
      const { user } = await authUser('/login/auth', dataLogin);
      addUserLocal({ name: user.name, email: user.email, token: user.token, role: user.role });
      router.push("/"); // Redireciona para a página inicial após o login
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    }
  };

  const validateInput = () => {
    const MIN_PASSWORD = 6;
    const REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/gm;
    const passwordTest = password.length < MIN_PASSWORD;
    const emailTest = !(REGEX.test(email));
   
    return emailTest || passwordTest;
  }

  return (
    <form className="flex justify-center items-center mt-5 p-3">
      <fieldset className="flex flex-col items-center bg-[#0056b312] border-[#93a1ef] rounded-md shadow-lg max-w-96 px-20 py-12">
        <h1 className="font-bradley text-2xl text-center mb-2 text-blue-800">Hipersorte</h1>
        <div className="flex flex-col items-center w-full">
          <Image
            src={Sorte}
            alt="sorte-logo"
            className="max-w-[200px] p-5"
          />
          <label htmlFor='email' className="flex flex-col w-full">
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
          <button
            type="submit"
            onClick={handleLogin}
            disabled={validateInput()}
            className={`${
              validateInput() ? 
                'bg-blue-200 text-blue-600 opacity-50 cursor-not-allowed' : 
                'bg-blue-600 text-white opacity-100 hover:bg-blue-700'
            } rounded-md h-10 w-[280px]`}
          >
            Entrar
          </button>
          <button
            type="button"
            className="bg-[#f2fffc] border border-[#0349ff24] rounded-md h-10 w-[280px] text-blue-600 cursor-pointer"
            onClick={handleRegistration}
          >
            Registrar
          </button>
          {err && (
            <span className="text-red-500" data-testid="common_register__element-invalid-login">
              {err}
            </span>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export default Login;
