CREATE DATABASE IF NOT EXISTS Biblioteca;

CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(250) UNIQUE NOT NULL,
    nome VARCHAR(240) UNIQUE NOT NULL,
    telefone CHAR(12) UNIQUE NOT NULL,
    senha VARCHAR(12),
    nascimento DATE
);

CREATE TABLE IF NOT EXISTS Livros (
    id_livros INT PRIMARY KEY AUTO_INCREMENT,
    publicacao DATE,
    autor VARCHAR(250)
);

CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    id_livro INT,
    nome VARCHAR(100),

    FOREIGN KEY (id_livro) REFERENCES Livros(id_livros)
);