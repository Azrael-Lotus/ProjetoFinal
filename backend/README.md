# Biblioteca API

API de usuários com Node.js, Express e Sequelize.

## Configuração

1. Copie o arquivo `.env` na raiz do projeto.
2. Ajuste as variáveis de ambiente para o banco de dados MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biblioteca
DB_USER=root
DB_PASS=
PORT=3000
```

## Instalação

```bash
npm install
```

## Execução em desenvolvimento / produção

```bash
npm start
```

## Testes

```bash
npm test
```

## Estrutura relevante

- `src/app.js` - define o app Express e middlewares
- `src/server.js` - inicializa o servidor e sincroniza o banco
- `src/config/database.js` - configuração do Sequelize e carregamento do `.env`
- `src/routes/userRoutes.js` - rotas de usuário
- `src/controllers/userController.js` - lógica CRUD de usuário
- `src/models/User.js` - modelo Sequelize do usuário
- `tests/user.test.js` - testes de integração com Supertest
