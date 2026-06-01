/**
 * Middleware centralizado para tratamento de erros
 * Padroniza todas as respostas de erro da API
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware para capturar e processar erros
 * Deve ser o último middleware registrado no Express
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Erro interno do servidor';

  // Erro de validação Sequelize
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Erro de validação',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Erro de email duplicado ou constraint única
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      statusCode: 409,
      message: 'Email ou dados duplicados',
      field: err.errors[0]?.path
    });
  }

  // Erro de banco de dados geral
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Erro ao acessar o banco de dados'
    });
  }

  // Erros operacionais conhecidos
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message
    });
  }

  // Erros desconhecidos
  console.error('Erro desconhecido:', err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Erro interno do servidor'
  });
};

/**
 * Wrapper para funções async em routes
 * Captura erros e passa para o middleware de erro
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = { AppError, errorHandler, catchAsync };
