// Importações necessárias para autenticação
const bcrypt = require('bcryptjs');  // Biblioteca para fazer hash de senhas
const jwt = require('jsonwebtoken'); // Biblioteca para criar tokens JWT
const User = require('../models/User'); // Modelo de usuário
const { catchAsync, AppError } = require('../middlewares/errorHandler');

// Chave secreta usada para assinar os tokens JWT
// Idealmente deve estar em variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

/**
 * Função para registrar um novo usuário
 * Recebe: nome, email e senha
 * Retorna: dados do usuário criado e token JWT
 */
exports.register = catchAsync(async (req, res, next) => {
  // Desestrutura os dados do corpo da requisição
  const { nome, email, senha } = req.body;

  // Valida se todos os campos obrigatórios foram fornecidos
  if (!nome || !email || !senha) {
    return next(new AppError('Nome, e-mail e senha são obrigatórios', 400));
  }

  // Verifica se o email já está cadastrado no banco
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new AppError('E-mail já cadastrado', 409));
  }

  // Criptografa a senha usando bcrypt (10 rounds de salt)
  const passwordHash = await bcrypt.hash(senha, 10);
  
  // Cria o novo usuário no banco de dados
  const user = await User.create({ name: nome, email, password: passwordHash });
  
  // Gera um token JWT válido por 8 horas
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });

  // Retorna o usuário criado e o token de autenticação
  return res.status(201).json({
    success: true,
    message: 'Usuário registrado com sucesso',
    user: { id: user.id, nome: user.name, email: user.email },
    token,
  });
});

/**
 * Função para fazer login de um usuário
 * Recebe: email e senha
 * Retorna: dados do usuário e token JWT se credenciais estiverem corretas
 */
exports.login = catchAsync(async (req, res, next) => {
  // Desestrutura email e senha do corpo da requisição
  const { email, senha } = req.body;

  // Valida se email e senha foram fornecidos
  if (!email || !senha) {
    return next(new AppError('E-mail e senha são obrigatórios', 400));
  }

  // Busca o usuário no banco de dados pelo email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError('E-mail ou senha incorretos', 401));
  }

  // Compara a senha fornecida com o hash armazenado no banco
  const validPassword = await bcrypt.compare(senha, user.password || '');
  if (!validPassword) {
    return next(new AppError('E-mail ou senha incorretos', 401));
  }

  // Gera um novo token JWT para a sessão do usuário
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
  
  // Retorna os dados do usuário e o token de autenticação
  return res.json({
    success: true,
    message: 'Login realizado com sucesso',
    user: { id: user.id, nome: user.name, email: user.email },
    token
  });
});
