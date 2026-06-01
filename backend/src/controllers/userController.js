// Importação do modelo de usuário
const User = require('../models/User');
const { catchAsync, AppError } = require('../middlewares/errorHandler');

/**
 * Obtém todos os usuários do banco de dados
 * GET /users
 * Retorna: lista de todos os usuários
 */
exports.getAll = catchAsync(async (req, res) => {
  const users = await User.findAll();
  res.json({
    success: true,
    data: users
  });
});

/**
 * Obtém um usuário específico pelo ID
 * GET /users/:id
 * Retorna: dados do usuário ou erro 404 se não encontrado
 */
exports.getById = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  
  if (!user) {
    return next(new AppError('Usuário não encontrado', 404));
  }
  
  res.json({
    success: true,
    data: user
  });
});

/**
 * Cria um novo usuário no banco de dados
 * POST /users
 * Retorna: dados do usuário criado com status 201
 */
exports.create = catchAsync(async (req, res) => {
  const user = await User.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Usuário criado com sucesso',
    data: user
  });
});

/**
 * Atualiza os dados de um usuário específico
 * PUT /users/:id
 * Retorna: dados do usuário atualizado ou erro 404 se não encontrado
 */
exports.update = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  
  if (!user) {
    return next(new AppError('Usuário não encontrado', 404));
  }
  
  await user.update(req.body);
  
  res.json({
    success: true,
    message: 'Usuário atualizado com sucesso',
    data: user
  });
});

/**
 * Deleta um usuário específico do banco de dados
 * DELETE /users/:id
 * Retorna: mensagem de sucesso ou erro 404 se não encontrado
 */
exports.remove = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  
  if (!user) {
    return next(new AppError('Usuário não encontrado', 404));
  }
  
  await user.destroy();
  
  res.json({
    success: true,
    message: 'Usuário removido com sucesso'
  });
});

