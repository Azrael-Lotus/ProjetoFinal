const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

// Define o modelo Order para registrar pedidos de usuários
// Cada pedido referencia um usuário por userId.
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendente',
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
