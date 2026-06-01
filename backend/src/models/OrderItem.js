const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const Book = require('./Book');

// Define o modelo OrderItem para os itens de cada pedido
// Cada item referencia um pedido e um livro específicos.
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'order_items',
  timestamps: true,
});

module.exports = OrderItem;
