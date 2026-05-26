git const request   = require('supertest');
const app       = require('../src/app.js');
const sequelize = require('../src/config/database');


beforeAll(async () => {
  await sequelize.sync({ force: true }); // recria tabelas
});


afterAll(async () => {
  await sequelize.close();
});


describe('Users API', () => {
  let userId;


  test('POST /users — cria usuário', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'João Silva', email: 'joao@email.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });


  test('GET /users — lista usuários', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });


  test('GET /users/:id — busca por ID', async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('joao@email.com');
  });


  test('PUT /users/:id — atualiza usuário', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .send({ name: 'João Atualizado' });
    expect(res.status).toBe(200);
  });


  test('DELETE /users/:id — remove usuário', async () => {
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.status).toBe(200);
  });


  test('GET /users/:id — 404 após remoção', async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.status).toBe(404);
  });
});
