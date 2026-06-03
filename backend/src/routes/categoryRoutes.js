// Roteador para endpoints de categoria
// Usado em app.js como /categories
const router = require('express').Router();
const controller = require('../controllers/categoryController');

// Lista todas as categorias
router.get('/', controller.getAll);

// Busca uma categoria pelo ID
router.get('/:id', controller.getById);

// Cria uma nova categoria
router.post('/', controller.create);

// Atualiza uma categoria existente pelo ID
router.put('/:id', controller.update);

// Remove uma categoria pelo ID
router.delete('/:id', controller.remove);

module.exports = router;
