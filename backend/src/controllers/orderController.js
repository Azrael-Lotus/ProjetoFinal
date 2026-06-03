const { Order, OrderItem, Book, User } = require('../models');
const sequelize = require('../config/database');
const { catchAsync, AppError } = require('../middlewares/errorHandler');

/**
 * Lista todos os pedidos com os itens e o usuário associado
 * GET /orders
 */
exports.getAll = catchAsync(async (req, res) => {
  const orders = await Order.findAll({ include: ['user', { model: OrderItem, as: 'items', include: ['book'] }] });
  res.json({ success: true, data: orders });
});

/**
 * Busca um pedido pelo ID
 * GET /orders/:id
 */
exports.getById = catchAsync(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id, { include: ['user', { model: OrderItem, as: 'items', include: ['book'] }] });
  if (!order) {
    return next(new AppError('Pedido não encontrado', 404));
  }
  res.json({ success: true, data: order });
});

/**
 * Cria um novo pedido com itens
 * POST /orders
 */
exports.create = catchAsync(async (req, res, next) => {
  const { userId, items = [], status } = req.body;
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return next(new AppError('Usuário e itens são obrigatórios', 400));
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return next(new AppError('Usuário não encontrado', 404));
  }

  const total = items.reduce((acc, item) => acc + (Number(item.unitPrice) * Number(item.quantity)), 0);

  const result = await sequelize.transaction(async (transaction) => {
    const order = await Order.create({ userId, total, status }, { transaction });

    const orderItems = await Promise.all(items.map(async (item) => {
      const book = await Book.findByPk(item.bookId);
      if (!book) {
        throw new AppError(`Livro não encontrado: ${item.bookId}`, 400);
      }

      return OrderItem.create({
        orderId: order.id,
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }, { transaction });
    }));

    return { order, items: orderItems };
  });

  res.status(201).json({ success: true, data: result });
});

/**
 * Remove um pedido pelo ID
 * DELETE /orders/:id
 */
exports.remove = catchAsync(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    return next(new AppError('Pedido não encontrado', 404));
  }
  await order.destroy();
  res.json({ success: true, message: 'Pedido removido com sucesso' });
});
