// Importações necessárias para configurar o banco de dados
const { Sequelize } = require('sequelize'); // ORM para interagir com o banco de dados
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Carrega variáveis de ambiente

// Cria a conexão com o banco de dados MySQL
// As credenciais são obtidas das variáveis de ambiente (.env)
const sequelize = new Sequelize(
  process.env.DB_NAME,    // Nome do banco de dados
  process.env.DB_USER,    // Usuário do banco de dados
  process.env.DB_PASS,    // Senha do banco de dados
  {
    host: process.env.DB_HOST,                                        // Endereço do servidor MySQL
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, // Porta (padrão: 3306)
    dialect: 'mysql',  // Tipo de banco de dados
    logging: false,    // Desativa logs de queries SQL
  }
);

// Exporta a instância Sequelize para usar em todo o projeto
module.exports = sequelize;
