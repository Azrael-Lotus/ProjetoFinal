// Importações necessárias para definir as rotas
const router = require('express').Router(); // Cria um novo router Express
const authController = require('../controllers/authController'); // Importa as funções de autenticação

// Rota para registrar um novo usuário
// POST /auth/register
router.post('/register', authController.register);

// Rota para fazer login
// POST /auth/login
router.post('/login', authController.login);

// Exporta as rotas para serem usadas em app.js
module.exports = router;
