const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

// Define o modelo Book para armazenar informações de livros
// Cada livro está associado a uma categoria por categoryId.
const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publication: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
}, {
  tableName: 'books',
  timestamps: true,
});

module.exports = Book;
