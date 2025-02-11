const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async ({ name, email, hash, role }) => {
  try {
    // Verificar se o email ou nome já existem
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { name },
        ],
      },
    });
    
    if (existingUser) {
      return false;
    }

    // Criar um novo usuário
    await prisma.users.create({ data: { name, email, password: hash, role }});
    return true;

  } catch (error) {
    throw error; // Ou trate o erro de acordo com suas necessidades
  }
};

const updateUser = async ({ name, email, password, role, id }) => {
  try {
    // Verificar se o usuário existe
    const existingUser = await prisma.users.findUnique({
      where: {
        id,
      },
    });


    if (!existingUser) {
      return false;
    }

    // Atualizar o usuário
    const userUpdate = await prisma.users.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password,
        role,
        // updatedAt: new Date(),
      },
    });

    return userUpdate;

  } catch (error) {
    throw error; // Ou trate o erro de acordo com suas necessidades
  }
};


module.exports = { createUser, updateUser };