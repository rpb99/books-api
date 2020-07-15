DROP DATABASE IF EXISTS books;
CREATE DATABASE books;
\c books;

CREATE TABLE publishers (
    publisher_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    total_pages INT NOT NULL,
    rating NUMERIC(2, 1),
    isbn VARCHAR(15) NOT NULL,
    published_date TIMESTAMP,
    publisher_id INT REFERENCES publishers(publisher_id) ON DELETE CASCADE
);

CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255)
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

CREATE TABLE book_authors (
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
    author_id INT REFERENCES authors(author_id) ON DELETE CASCADE
);


-- Insert Table

-- publishers
INSERT INTO publishers (name) VALUES ('Riki');
INSERT INTO publishers (name) VALUES ('Andi');

-- books
INSERT INTO 
    books (title, total_pages, rating, isbn, published_date, publisher_id) 
VALUES 
    ('My Adventure', 256, 4.5, '123-456-789-00', (SELECT NOW()), 1);
INSERT INTO 
    books (title, total_pages, rating, isbn, published_date, publisher_id) 
VALUES 
    ('My Lion', 555, 1.2, '542-542-555-65', (SELECT NOW()), 1);
INSERT INTO 
    books (title, total_pages, rating, isbn, published_date, publisher_id)
VALUES 
    ('Love Node.js', 855, 5, '452-555-123-12', (SELECT NOW()), 2);

-- genres
INSERT INTO genres (genre) VALUES ('Action');
INSERT INTO genres (genre) VALUES ('Adventure');
INSERT INTO genres (genre) VALUES ('Fantasy');




-- book_genres
INSERT INTO book_genres VALUES (3, 2);
INSERT INTO book_genres VALUES (2, 3);


-- authors
INSERT INTO authors (first_name, middle_name, last_name) 
VALUES ('Riki', 'L', 'Febrianto');
INSERT INTO authors (first_name, last_name) 
VALUES ('Sapto', 'Nanda');


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
SELECT books.title, authors.first_name
FROM book_authors
JOIN books 
    ON books.book_id = book_authors.book_id
JOIN authors 
    ON authors.author_id = book_authors.author_id
WHERE books.book_id = 3;