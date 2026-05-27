// Importação do modelo de usuário
const User = require('../models/User');

/**
 * Obtém todos os usuários do banco de dados
 * GET /users
 * Retorna: lista de todos os usuários
 */
exports.getAll = async (req, res) => {
  try {
    // Busca todos os usuários na tabela
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

/**
 * Obtém um usuário específico pelo ID
 * GET /users/:id
 * Retorna: dados do usuário ou erro 404 se não encontrado
 */
exports.getById = async (req, res) => {
  try {
    // Busca o usuário pela chave primária (ID)
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

/**
 * Cria um novo usuário no banco de dados
 * POST /users
 * Retorna: dados do usuário criado com status 201
 */
exports.create = async (req, res) => {
  try {
    // Cria um novo usuário com os dados fornecidos no corpo da requisição
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

/**
 * Atualiza os dados de um usuário específico
 * PUT /users/:id
 * Retorna: mensagem de sucesso ou erro 404 se não encontrado
 */
exports.update = async (req, res) => {
  try {
    // Atualiza o usuário com o ID especificado com os novos dados
    // Retorna número de linhas afetadas
    const [updated] = await User.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

/**
 * Deleta um usuário específico do banco de dados
 * DELETE /users/:id
 * Retorna: mensagem de sucesso ou erro 404 se não encontrado
 */
exports.remove = async (req, res) => {
  try {
    // Deleta o usuário com o ID especificado
    // Retorna número de linhas afetadas
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ message: 'Removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover usuário' });
  }
};

