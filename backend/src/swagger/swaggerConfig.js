// Importações necessárias para configurar o Swagger
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc'); // Gera documentação Swagger a partir de comentários JSDoc

// Configuração das opções do Swagger
const options = {
    definition: {
        // Define a versão OpenAPI
        openapi: '3.0.0',
        // Informações gerais da API
        info: {
            title: 'Minha API',
            version: '1.0.0',
            description: 'API de usuários com Node.js e MySQL',
        },
        // URL base do servidor
        servers: [{ url: 'http://localhost:3000' }],
    },
    // Procura pelos comentários Swagger em todos os arquivos de rotas
    apis: [path.join(__dirname, '../routes/*.js')],
};

// Exporta a especificação Swagger gerada
// Será usada para servir a documentação em /api-docs
module.exports = swaggerJsdoc(options);

