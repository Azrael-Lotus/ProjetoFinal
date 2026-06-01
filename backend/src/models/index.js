const User = require('./User');
const Category = require('./Category');
const Book = require('./Book');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Registra as associações entre os modelos do Sequelize.
// Essas associações garantem que as chaves estrangeiras e relações estejam definidas
// antes de executar `sequelize.sync()`.

// Categoria -> Livro: uma categoria contém muitos livros
Category.hasMany(Book, {
  foreignKey: 'categoryId',
  as: 'books',
});
Book.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// Usuário -> Pedido: um usuário pode ter vários pedidos
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Pedido -> ItemPedido: um pedido pode ter muitos itens
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

// Livro -> ItemPedido: um livro pode aparecer em muitos itens de pedido
Book.hasMany(OrderItem, {
  foreignKey: 'bookId',
  as: 'orderItems',
});
OrderItem.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book',
});

module.exports = {
  User,
  Category,
  Book,
  Order,
  OrderItem,
};
