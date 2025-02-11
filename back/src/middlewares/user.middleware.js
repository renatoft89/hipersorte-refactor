// Middleware de validação dos dados do usuário
const validateUserData = async (req, res, next) => {
  const { email, password, name, role } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Campo "email" é obrigatório' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Campo "password" é obrigatório' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Campo "name" é obrigatório' });
  }

  if (!role) {
    return res.status(400).json({ message: 'Campo "role" é obrigatório' });
  }

  // Verifica o formato do email usando uma expressão regular
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Formato de email inválido' });
  }

  // Verifica se a senha tem pelo menos 6 caracteres
  if (password.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' });
  }

  // Verifica se a senha não contém apenas números
  if (/^\d+$/.test(password)) {
    return res.status(400).json({ message: 'A senha não pode conter apenas números' });
  }

  // Se todos os critérios de validação passarem, chame o próximo middleware
  next();
}

module.exports = { validateUserData };