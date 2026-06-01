// Importações das dependências necessárias
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const sequelize = require('./config/database');
require('./models');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

// Cria a aplicação Express
const app = express();

// Middlewares globais
// CORS: permite requisições de diferentes origens
app.use(cors());
// Parse de JSON: transforma requisições com corpo JSON em objetos JavaScript
app.use(express.json());

// Documentação Swagger: disponível em /api-docs
// Interface visual para testar os endpoints da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da aplicação
// /auth: endpoints de autenticação (login e registro)
app.use('/auth', authRoutes);
// /users: endpoints de gerenciamento de usuários (CRUD)
app.use('/users', userRoutes);

// Middleware centralizado de tratamento de erros
// Deve ser o último middleware registrado
app.use(errorHandler);

// Executa quando o arquivo é executado diretamente (não importado)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  // Sincroniza os modelos Sequelize com o banco de dados
  sequelize.sync().then(() => {
    // Inicia o servidor Express na porta especificada
    app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));
    console.log('Swagger: http://localhost:3000/api-docs');
  }).catch((err) => {
    console.error('Falha ao iniciar o servidor:', err);
    process.exit(1);
  });
}

// Exporta a aplicação para ser usada em server.js
module.exports = app;