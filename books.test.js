process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
const db = require('./db');
const ExpressError = require('./expressError');
const Book = require ('./models/book');



describe('Creating a new book', () => {
    test('with valid schema', async () => {
        let book = {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
          };

        const resp = await request(app).post('/books')
            .send(book);

        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({ book: book });
    });

    test('with missing property', async () => {
        let incorrectBook = {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
          };

          const resp = await request(app).post('/books')
            .send(incorrectBook);

        expect(resp.statusCode).toEqual(400);
    });

    test('with incorrect property type', async () => {
        let incorrectBook = {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": "264",
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
          };

          const resp = await request(app).post('/books')
            .send(incorrectBook);

        expect(resp.statusCode).toEqual(400);
    });
});

describe('Updating a book', () => {
    beforeEach(async () => {
        await Book.create({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
          });
    });

    test('with valid schema', async () => {
        let book = {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Broderick McDonald",
            "language": "russian",
            "pages": 550,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
          };

        const resp = await request(app).put('/books/0691161518')
          .send(book);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({ book: book });
    });

    test('with invalid schema', async () => {
        let book = {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Broderick McDonald",
            "language": "russian",
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": "2017"
          };

          const resp = await request(app).put('/books/0691161518')
            .send(book);

          expect(resp.statusCode).toEqual(400);
    });
});

afterEach(async () => {
    await db.query('DELETE FROM books');
});

afterAll(async () => {
    await db.end();
});