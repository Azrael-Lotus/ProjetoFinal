// Importações necessárias para autenticação
const bcrypt = require('bcryptjs');  // Biblioteca para fazer hash de senhas
const jwt = require('jsonwebtoken'); // Biblioteca para criar tokens JWT
const User = require('../models/User'); // Modelo de usuário

// Chave secreta usada para assinar os tokens JWT
// Idealmente deve estar em variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

/**
 * Função para registrar um novo usuário
 * Recebe: nome, email e senha
 * Retorna: dados do usuário criado e token JWT
 */
exports.register = async (req, res) => {
  // Desestrutura os dados do corpo da requisição
  const { nome, email, senha } = req.body;

  // Valida se todos os campos obrigatórios foram fornecidos
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    // Verifica se o email já está cadastrado no banco
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    // Criptografa a senha usando bcrypt (10 rounds de salt)
    const passwordHash = await bcrypt.hash(senha, 10);
    // Cria o novo usuário no banco de dados
    const user = await User.create({ name: nome, email, password: passwordHash });
    // Gera um token JWT válido por 8 horas
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });

    // Retorna o usuário criado e o token de autenticação
    return res.status(201).json({
      user: { id: user.id, nome: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    // Trata erros de constraint única (email duplicado)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
};

/**
 * Função para fazer login de um usuário
 * Recebe: email e senha
 * Retorna: dados do usuário e token JWT se credenciais estiverem corretas
 */
exports.login = async (req, res) => {
  // Desestrutura email e senha do corpo da requisição
  const { email, senha } = req.body;

  // Valida se email e senha foram fornecidos
  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    // Busca o usuário no banco de dados pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'E-mail ou senha incorretos.' });
    }

    // Compara a senha fornecida com o hash armazenado no banco
    const validPassword = await bcrypt.compare(senha, user.password || '');
    if (!validPassword) {
      return res.status(400).json({ error: 'E-mail ou senha incorretos.' });
    }

    // Gera um novo token JWT para a sessão do usuário
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
    // Retorna os dados do usuário e o token de autenticação
    return res.json({ user: { id: user.id, nome: user.name, email: user.email }, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};
