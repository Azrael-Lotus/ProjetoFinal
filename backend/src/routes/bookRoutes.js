// Roteador para endpoints de livro
// Usado em app.js como /books
const router = require('express').Router();
const controller = require('../controllers/bookController');

// Lista todos os livros com suas categorias
router.get('/', controller.getAll);

// Busca um livro pelo ID
router.get('/:id', controller.getById);

// Cria um novo livro
router.post('/', controller.create);

// Atualiza um livro existente pelo ID
router.put('/:id', controller.update);

// Remove um livro pelo ID
router.delete('/:id', controller.remove);

module.exports = router;
