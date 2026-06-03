// Roteador para endpoints de pedido
// Usado em app.js como /orders
const router = require('express').Router();
const controller = require('../controllers/orderController');

// Lista todos os pedidos com itens e usuário
router.get('/', controller.getAll);

// Busca um pedido pelo ID
router.get('/:id', controller.getById);

// Cria um novo pedido com itens
router.post('/', controller.create);

// Remove um pedido pelo ID
router.delete('/:id', controller.remove);

module.exports = router;
