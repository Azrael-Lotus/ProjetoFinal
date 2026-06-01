const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define o modelo Category para armazenar categorias de livros
// Este modelo corresponde à tabela `categories` no MySQL.
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'categories',
  timestamps: true,
});

module.exports = Category;
