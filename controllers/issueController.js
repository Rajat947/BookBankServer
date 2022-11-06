const User = require('./../models/user');
const Issue = require('../models/issue');
const Book = require('./../models/book');
const catchAsync = require("../utils/catchAsync");
const book = require('./../models/book');

module.exports.getAllIssues = catchAsync(async function(req,res,next){
    const issues = await Issue.find({}).populate('student').populate('book')
    if(issues.length === 0){
        return res.status(404).json({
            'status': 'success',
            'msg': "No Issues",
            data:null
        })
    }
    return res.status(200).json({
        'status': 'success',
        'msg': "Issues Found",
        data : issues
    })
})

module.exports.getAllIssuesByAUser = catchAsync(async function(req,res,next){
    // console.log(req.user);
    // console.log("\n\n\n Object ID =====" +req.user._id);
    const issuesByAUser = await Issue.find({student: req.user._id}).populate('student').
    populate('book');
    if(issuesByAUser.length === 0){
        return res.status(404).json({
            'status': 'failure',
            'msg': "No Issues Exists",
            data : null
        })    
    }
    const data = [];
    for (let i = 0; i < issuesByAUser.length; i++) {
        data.push(issuesByAUser[i].book)
    }
    return res.status(200).json({
        'status': 'success',
        'msg': "Issues Found of an User",
        data
    })
})
module.exports.issueABook = catchAsync(async function(req,res,next){
    //find that book with slug;
    let slug = req.params.slug;
    const bookFound = await Book.findOne({slug});
    if(!bookFound){
        return res.status(200).json({
            "status" : "failure",
            "msg":"Book Not Found!",
            data:null
        })
    }
    if(bookFound.copies === 0){
        return res.status(200).json({
            "status" : "failure",
            "msg":"Book Not available in the library!",
            data:null
        })
    }
    const bookID = bookFound._id;
    const userID = req.user._id;
    const newCopies = bookFound.copies; 
    // console.log(bookID,userID);
    const issuesByUser = await Issue.find({student:req.user._id}).populate('student').populate('book');
    for (let i = 0; i < issuesByUser.length; i++) {
        const bookIssued = issuesByUser[i].book;
        if(bookIssued.slug === slug){
            return res.status(400).json({
                "status" : "failure",
                "msg" : "Book already Issued!"
            })
        }   
    }
    const issueResult = await Issue.create({
        student: userID,
        book : bookID,
    })
    await Book.findByIdAndUpdate(bookID, {copies: newCopies - 1});
    return res.status(200).json({
        "status" : "success",
        "msg":"Book was Issued Successfully!",
        data:issueResult
    })
})

module.exports.returnABook = catchAsync(async function(req,res,next){
    const slug = req.params.slug;
    const bookFound = await Book.findOne({slug});
    if(!bookFound){
        return res.status(200).json({
            "status" : "failure",
            "msg":"Book Not Found!",
            data:null
        })
    }
    const userID = req.user._id;
    const bookID = bookFound._id;

    const issuesByUser = await Issue.find({student:req.user._id}).populate('student').populate('book');
    let bookFoundInUserAcc = false;
    let issueID = null;
    for (let i = 0; i < issuesByUser.length; i++) {
        const bookIssued = issuesByUser[i].book;        
        if(bookIssued.slug === slug){
            bookFoundInUserAcc = true;
            issueID = issuesByUser._id;
            break;
        }   
    }
    if(!bookFoundInUserAcc){
        return res.status(200).json({
            "status" : "failure",
            "msg":"Book Not Found in User Account!"
        })
    }
    //book found in user account
    //deleting issue record and updating copies in book collections
    const newCopies = bookFound.copies;
    await Issue.findByIdAndDelete(issueID);
    await Book.findByIdAndUpdate(bookID, {copies:newCopies + 1});
    return res.status(200).json({
            "status" : "success",
            "msg":"Book was returned Successfully!",
            data:null
    })

})