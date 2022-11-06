const express = require('express');
const router = express.Router();
const Books = require('../models/book');
const authController = require('../controllers/authController');
const catchAsync = require('../utils/catchAsync');
const bookController = require('../controllers/bookController')

//get all books
router.route('/')
.get(bookController.getAllBooks)
//add a book
.post(authController.protect, authController.adminOnly(), bookController.addABook)

//get a book by its slug
router.route('/:slug')
.get(bookController.getABookByID)
.patch(authController.protect, authController.adminOnly(), bookController.updateCopies)
.delete(authController.protect, authController.adminOnly(),bookController.deleteABook)
module.exports = router;

router.route('/search/:query')
.get(bookController.searchQuery);