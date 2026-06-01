# Modelo lógico e DER/MER

Este documento descreve o modelo lógico do banco de dados e as relações entre as entidades. O esquema é baseado na necessidade de usuários, categorias, livros e pedidos.

## Entidades principais

- `users`
- `categories`
- `books`
- `orders`
- `order_items`

## Relacionamentos

- Um `users` pode ter vários `orders`
- Um `orders` pertence a um único `users`
- Um `books` pertence a uma única `categories`
- Uma `categories` pode ter vários `books`
- Um `orders` pode ter vários `order_items`
- Cada `order_items` referencia um único `books`

## Diagrama ERD (Mermaid)

```mermaid
erDiagram
    users {
        INT id PK
        VARCHAR name
        VARCHAR email UNIQUE
        VARCHAR password
    }
    categories {
        INT id PK
        VARCHAR name UNIQUE
        VARCHAR description
    }
    books {
        INT id PK
        VARCHAR title
        VARCHAR author
        DATE publication
        DECIMAL price
        INT categoryId FK
    }
    orders {
        INT id PK
        INT userId FK
        DATETIME orderDate
        DECIMAL total
        VARCHAR status
    }
    order_items {
        INT id PK
        INT orderId FK
        INT bookId FK
        INT quantity
        DECIMAL unitPrice
    }

    users ||--o{ orders : "faz"
    categories ||--o{ books : "contém"
    books ||--o{ order_items : "é parte de"
    orders ||--o{ order_items : "possui"
```

## Integridade referencial e constraints

- `email` de `users` é único.
- `categories.name` é único.
- `books.categoryId` referencia `categories(id)` com `ON UPDATE CASCADE` e `ON DELETE RESTRICT`.
- `orders.userId` referencia `users(id)` com `ON UPDATE CASCADE` e `ON DELETE RESTRICT`.
- `order_items.orderId` referencia `orders(id)` com `ON UPDATE CASCADE` e `ON DELETE CASCADE`.
- `order_items.bookId` referencia `books(id)` com `ON UPDATE CASCADE` e `ON DELETE RESTRICT`.
