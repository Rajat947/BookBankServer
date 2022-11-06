const slugify = require('slugify');
const fs = require('fs');
const db = require('./db');
const book = require('../models/book');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
db();
try {
    const jsonString = fs.readFileSync("./config/data.json");
    const books = JSON.parse(jsonString);
    console.log(books);

    let newBookData = [];
    for (let i = 0; i < books.length; i++) {
        let title = books[i].title;
        let year = books[i].year;
        if(year < 1500) year = 2014;
        let author = books[i].author;
        let copies = Math.floor((Math.random() * 100) + 1);
        let newBook = {};
        newBook.name = title;
        newBook.author = author;
        newBook.yop = year;
        newBook.copies = copies;
        newBook.slug = slugify(title, {lower:true});
        newBookData.push(newBook);
    }

    console.log(newBookData);
    book.insertMany(newBookData); 
} catch (err) {
   console.log(err);
   return;
}