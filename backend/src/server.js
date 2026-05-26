const sequelize = require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));
  console.log('Swagger: http://localhost:3000/api-docs');
}).catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});
