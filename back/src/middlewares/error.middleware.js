const errors = {
  ValidationError: 400,
  NotFound: 404,
};

const errorMiddleware = (error, _req, res, _next) => {
  const { message, name } = error;
  console.log(error);
  const status = errors[name];
  if (!status) {
      console.log('Middleware de Erro', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
  return res.status(status).json({ message });
};

module.exports = errorMiddleware;