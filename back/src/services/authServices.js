const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const authService = async (email, password) => {
  const error = { erro: 'E-mail ou senha incorretos.' }

  const user = await prisma.users.findUnique({ where: { email }}); 
  
  if (!user) {
    return error;
  }
  
  const verifyPassword = await compare(password, user.password);
  if (!verifyPassword) {
    return error;
  }

  const token = sign({ id: user.id }, "secretKey", { expiresIn: '1d'});

  const result = { id: user.id, name: user.name, email: user.email, role: user.role, token  }

  return result

}

module.exports = { authService };