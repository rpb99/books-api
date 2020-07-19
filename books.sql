DROP DATABASE IF EXISTS books;
CREATE DATABASE books;
\c books;


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(25) DEFAULT 'user',
    created_at TIMESTAMP
);

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    total_pages VARCHAR(50) NOT NULL,
    isbn VARCHAR(15) NOT NULL,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    published_date TIMESTAMP,
);

INSERT INTO 
    books (title, description, image, total_pages, isbn, published_date, user_id) 
VALUES 
    ('My Adventure','once upon a time there is a young girl live with her grandma.', '', 256, '123-456-789-00', (SELECT NOW()), 7);

CREATE TABLE rating (
    rating_id SERIAL PRIMARY KEY,
    rating NUMERIC(2, 1)
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
);

CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE book_authors (
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
    author_id INT REFERENCES authors(author_id) ON DELETE CASCADE,
    created_at TIMESTAMP
);

CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    genre VARCHAR(55) UNIQUE NOT NULL
);

CREATE TABLE book_genres (
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id)
);




-- Insert Table

-- users
INSERT INTO users (username,password,email,role, created_at) 
VALUES ('Riki','12345','riki@gmail.com','user',(SELECT NOW()));

UPDATE users SET role = 'admin' WHERE username = 'Riki';

-- publishers
INSERT INTO publishers (name) VALUES ('Riki');
INSERT INTO publishers (name) VALUES ('Andi');

-- books

INSERT INTO 
    books (title, description, image, total_pages, isbn, user_id, published_date) 
VALUES 
    ('My Adventure','once upon a time there is a young girl live with her grandma.', '', 256, '123-456-789-00', 32, (SELECT NOW()));
INSERT INTO 
    books (title, description, image, total_pages, isbn, user_id, published_date) 
VALUES 
    ('My Lion', 'once upon a time there is a young girl live with her grandma.', '', 555, '542-542-555-65', 33, (SELECT NOW()));
INSERT INTO 
    books (title, description, image, total_pages, isbn, user_id, published_date)
VALUES 
    ('Love Node.js', 'once upon a time there is a young girl live with her grandma.', '', 855, '452-555-123-12', 32, (SELECT NOW()));

UPDATE books SET title='i change', description='my description', image='/dev', total_pages=456, isbn='234-23524-35', published_date=(SELECT NOW()) WHERE book_id = 8;

-- genres
INSERT INTO genres (genre) VALUES ('Action');
INSERT INTO genres (genre) VALUES ('Adventure');
INSERT INTO genres (genre) VALUES ('Fantasy');




-- book_genres
INSERT INTO book_genres VALUES (3, 2);
INSERT INTO book_genres VALUES (2, 3);


-- authors
INSERT INTO authors (first_name, middle_name, last_name, user_id, created_at) 
VALUES ('Riki', 'L', 'Febrianto', 33, (SELECT NOW()));
INSERT INTO authors (first_name, last_name, user_id, created_at) 
VALUES ('Sapto', 'Nanda', 32, (SELECT NOW()));

-- book_authors
INSERT INTO book_authors VALUES (2, 2);
INSERT INTO book_authors VALUES (1, 2);
INSERT INTO book_authors VALUES (3, 1);




-- Relationships

-- -- One Publisher has many books //books
-- SELECT publishers.name,books.title
-- FROM publishers
-- JOIN books
-- ON publishers.publisher_id = books.publisher_id;

-- -- One Book have one Genre //book_genres
-- SELECT books.title, genres.genre
-- FROM book_genres
-- JOIN books 
--     ON books.book_id = book_genres.book_id
-- JOIN genres 
--     ON genres.genre_id = book_genres.genre_id;

-- One or more authors has many books //book_authors
SELECT books.title, books.user_id, authors.first_name
FROM book_authors
JOIN books 
    ON books.book_id = book_authors.book_id
JOIN authors 
    ON authors.author_id = book_authors.author_id;