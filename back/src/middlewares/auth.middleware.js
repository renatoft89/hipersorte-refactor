const { verify } = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('Auth Header:', authHeader); // Adicione este log para depuração
  

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido ou mal formatado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verify(token, 'secretKey');
    req.user = decoded; // você pode acessar req.user nas rotas
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;
