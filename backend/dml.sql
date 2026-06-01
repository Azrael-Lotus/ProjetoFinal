USE Biblioteca;

INSERT INTO users (name, email, password, createdAt, updatedAt) VALUES
('Maria Silva', 'maria@example.com', 'senha123', NOW(), NOW()),
('João Pereira', 'joao@example.com', 'senha456', NOW(), NOW());

INSERT INTO categories (name, description, createdAt, updatedAt) VALUES
('Ficção', 'Livros de ficção moderna e clássica', NOW(), NOW()),
('Fantasia', 'Livros de fantasia e aventuras mágicas', NOW(), NOW());

INSERT INTO books (title, author, publication, price, categoryId, createdAt, updatedAt) VALUES
('A Viagem', 'Lucia Carvalho', '2021-09-10', 49.90, 1, NOW(), NOW()),
('O Reino Perdido', 'Pedro Souza', '2020-07-21', 59.90, 2, NOW(), NOW());

INSERT INTO orders (userId, orderDate, total, status, createdAt, updatedAt) VALUES
(1, '2024-05-01 10:14:00', 109.80, 'finalizado', NOW(), NOW());

INSERT INTO order_items (orderId, bookId, quantity, unitPrice, createdAt, updatedAt) VALUES
(1, 1, 1, 49.90, NOW(), NOW()),
(1, 2, 1, 59.90, NOW(), NOW());
