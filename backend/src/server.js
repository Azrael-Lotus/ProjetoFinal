// Importações necessárias para iniciar o servidor
const sequelize = require('./config/database'); // Configuração do banco de dados
const app = require('./app'); // Configuração da aplicação Express

// Define a porta do servidor (usa variável de ambiente ou porta padrão 3000)
const PORT = process.env.PORT || 3000;

// Sincroniza os modelos com o banco de dados e inicia o servidor
// { alter: true } atualiza o banco automaticamente se necessário
sequelize.sync({ alter: true }).then(() => {
  // Inicia o servidor na porta especificada
  app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));
  console.log('Swagger: http://localhost:3000/api-docs');
}).catch((err) => {
  // Tratamento de erro se a sincronização falhar
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});
