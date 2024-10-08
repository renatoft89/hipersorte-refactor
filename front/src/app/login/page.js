"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addUserLocal } from '../../services/localStorage';
import { authUser } from '../../services/requests';
import Image from 'next/image';
import Sorte from '../../img/sorte.png';

const Login = () => {
  const router = useRouter();
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
      history.push("/");
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    }
  };

  const validateInput = () => {
    const MIN_PASSWORD = 6;
    const REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/gm;
    const passwordTest = password.length < MIN_PASSWORD;
    const emailTest = !(REGEX.test(email));
    return !(emailTest || passwordTest);
  }

  return (
    <form className="flex justify-center items-center mt-5 p-5">
      <fieldset className="flex flex-col items-center bg-[#0056b312] border border-[#93a1ef] rounded-md shadow-lg max-w-96 px-16 py-16">
        <h1 className="font-bradley text-2xl text-center mb-2">Hipersorte</h1>
        <label htmlFor='email' className="flex flex-col w-full">
          <Image
            src={Sorte}
            alt="sorte-logo"
            className="max-w-[200px] p-5"
          />
          <span className="text-left mb-1">Email:</span>
          <input
            type="email"
            className="border border-black rounded-md mb-3 p-2 w-full max-w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            name="email"
            onChange={handleChange}
          />
          <span className="text-left mb-1">Senha:</span>
          <input
            className='border border-black rounded-md mb-4 p-2 w-full max-w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-300'
            type="password"
            value={password}
            name='password'
            onChange={handleChange}
          />
        </label>
        <div className="flex flex-col space-y-4 w-full">
          <button
            type="submit"
            onClick={handleLogin}
            disabled={validateInput()}
            className={`bg-blue-600 text-white rounded-md h-10 w-full cursor-pointer ${validateInput() ? 'opacity-50' : ''}`}
          >
            Entrar
          </button>
          <button
            type="button"
            className="bg-[#f2fffc] border border-[#0349ff24] rounded-md h-10 w-full text-blue-600 cursor-pointer"
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
