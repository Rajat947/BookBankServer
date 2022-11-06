const express = require('express');
const router = express.Router();
const issueController = require('./../controllers/issueController')
const Issue = require('../models/issue');
const authController = require('../controllers/authController');
const catchAsync = require('../utils/catchAsync');
const bookController = require('../controllers/bookController')

//to see all issues in the library -> admin only route
router.route('/')
.get(authController.protect,authController.adminOnly(),issueController.getAllIssues)

router.route('/student')
.get(authController.protect , issueController.getAllIssuesByAUser)
//about a book
router.route('/student/:slug')
.post(authController.protect, issueController.issueABook)

router.route('/student/return/:slug')
.post(authController.protect, issueController.returnABook)
module.exports = router;