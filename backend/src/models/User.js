// Importações necessárias para definir o modelo
const { DataTypes } = require('sequelize'); // Tipos de dados para campos da tabela
const sequelize = require('./../config/database'); // Conexão com o banco de dados

// Define o modelo de usuário que corresponde à tabela 'users' no banco
const User = sequelize.define('User', {
  // Campo ID: chave primária auto-incrementada
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // Campo nome: obrigatório, string
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Campo email: obrigatório, único e com validação de formato
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Cada email deve ser único
    validate: {
      isEmail: true, // Valida se é um email válido
    },
  },
  // Campo senha: opcional, pode ser null
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'users',  // Nome da tabela no banco de dados
  timestamps: true,    // Adiciona campos createdAt e updatedAt automaticamente
});

// Exporta o modelo para usar em controllers
module.exports = User;
