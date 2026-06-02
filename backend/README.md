# Biblioteca API

API REST para gerenciamento de usuários construída com Node.js, Express e Sequelize.

## Principais recursos

- CRUD completo para `User` (listar, buscar, criar, atualizar, remover)
- Validação de dados via Sequelize (`isEmail`, `allowNull`, etc.)
- Tratamento de erros centralizado (`src/middlewares/errorHandler.js`)
- Documentação de API com Swagger disponível em `/api-docs`

## Tecnologias

- Node.js
- Express
- Sequelize (MySQL)
- JWT para autenticação
- Swagger (swagger-jsdoc + swagger-ui-express)

## Pré-requisitos

- Node.js 18+ (ou compatível)
- MySQL em execução

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biblioteca
DB_USER=root
DB_PASS=
PORT=3000
JWT_SECRET=sua_chave_secreta_jwt_aqui
```

O projeto já inclui `.env.example` na raiz do backend.

## Instalação

```bash
npm install
```

## Executando

- Iniciar em produção/development (conforme `package.json`):

```bash
npm start
```

- Iniciar com `nodemon` (recomendado para desenvolvimento):

```bash
npx nodemon src/server.js
```

Ao subir, o servidor sincroniza os modelos com o banco via `sequelize.sync()`.

## Documentação da API (Swagger)

A documentação interativa está disponível em:

```
http://localhost:3000/api-docs
```

## Endpoints principais

- POST /auth/register — registra usuário
	- Body: `{ "nome": "...", "email": "...", "senha": "..." }`
- POST /auth/login — autentica e retorna token
	- Body: `{ "email": "...", "senha": "..." }`

- GET /users — lista usuários
- GET /users/:id — busca usuário por ID
- POST /users — cria usuário
- PUT /users/:id — atualiza usuário
- DELETE /users/:id — remove usuário

- GET /categories — lista categorias
- GET /categories/:id — busca categoria por ID
- POST /categories — cria categoria
- PUT /categories/:id — atualiza categoria
- DELETE /categories/:id — remove categoria

- GET /books — lista livros
- GET /books/:id — busca livro por ID
- POST /books — cria livro
- PUT /books/:id — atualiza livro
- DELETE /books/:id — remove livro

- GET /orders — lista pedidos
- GET /orders/:id — busca pedido por ID
- POST /orders — cria pedido
- DELETE /orders/:id — remove pedido

Exemplo rápido (registro):

```bash
curl -X POST http://localhost:3000/auth/register \
	-H "Content-Type: application/json" \
	-d '{"nome":"João","email":"joao@example.com","senha":"senha123"}'
```

Exemplo login:

```bash
curl -X POST http://localhost:3000/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"joao@example.com","senha":"senha123"}'
```

## Testes

Os testes usam `jest` e `supertest`.

```bash
npm test
```

## Tratamento de erros e validação

- Existe um middleware central em `src/middlewares/errorHandler.js` que padroniza respostas de erro
- Erros do Sequelize (validação, constraint única) são tratados especificamente

## Observações sobre banco de dados

- O projeto utiliza `sequelize.sync({ alter: true })` no `src/server.js` para aplicar alterações de modelo automaticamente.
- Para produção recomenda-se usar migrações controladas em vez de `sync({ alter: true })`.
- O repositório inclui scripts e documentação de banco de dados:
  - `backend/BribriotrecaSQL.sql` — script DDL de criação de tabelas
  - `backend/dml.sql` — script DML com dados de exemplo
  - `backend/database-model.md` — modelo lógico e DER/MER com diagrama

## Contribuição

- Abra uma issue para discutir mudanças maiores
- Pull requests são bem-vindos

---
Se quiser, atualizo também o README raiz do repositório para unificar front e backend.
