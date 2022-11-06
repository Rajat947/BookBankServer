const catchAsync = require('../utils/catchAsync');
const Book = require('../models/book');
const AppError = require('../utils/appError');
const slugify = require('slugify');
const book = require('../models/book');

module.exports.getAllBooks = catchAsync(async function(req,res,next){
    const books = await Book.find({}).sort({name: 'asc'});
    return res.status(200).json({
        status:"success",
        books
    })
})
module.exports.addABook = catchAsync(async function(req,res,next){
    let book = {
        name: req.body.name,
        author: req.body.author,
        copies: req.body.copies,
        yop: Number(req.body.yop)
    }
    book.slug = slugify(req.body.name,{lower:true});
    await Book.create(book);
    return res.status(200).json({
        "status" : "success",
        "msg": "Book(s) was added successfully"
    });
})
module.exports.getABookByID = catchAsync(async function(req,res,next){
    const book = await Book.find({slug:req.params.slug});
    if(book.length === 0){
        return res.status(404).json({
            "status": "failure",
            "msg" : "Book Not Found!"
        })
    }
    return res.status(200).json({
        "status": "success",
        book
    })
})
module.exports.updateCopies = catchAsync(async function(req,res,next){
    const book = await Book.find({slug:req.params.slug});
    if(book.length === 0){
        return res.status(404).json({
            "status": "failure",
            "msg" : "Book Not Found!"
        })
    }
    const newCopies = req.body.copies;
    if(newCopies < 0)
        return next(new AppError("Please enter valid number of Copies", 400))
    book.copies = newCopies;
    const data = await Book.findOneAndUpdate(
        {
            slug:req.params.slug
        },
        {
            $set:{
                    copies: newCopies,  // Fields which we need to update
                 }
        },
        { 
        new: true  // option part ( new: true will provide you updated data in response )
        });
    // console.log(res);
    return res.status(200).json({
        "status" : "success",
        "msg" : "Book Updated Successfully",
        data
    })
})
module.exports.deleteABook = catchAsync(async function(req,res,next){
    const book = await Book.find({slug:req.params.slug});
    if(book.length === 0){
        return res.status(404).json({
            "status": "failure",
            "msg" : "Book Not Found!"
        })
    }
    const data = await Book.findOneAndUpdate(
        {
            slug:req.params.slug
        },
        {
            $set:{
                    copies: 0,  // Fields which we need to update
                 }
        },
        { 
        new: true  // option part ( new: true will provide you updated data in response )
        });
    // console.log(res);
    return res.status(200).json({
        "status" : "success",
        "msg" : "Book Deleted Successfully",
        data : null
    })
})
module.exports.searchQuery = catchAsync(async function(req,res,next){
    let query = req.params.query;
    let queryNumber = Number(query);
    if(isNaN(queryNumber)){
        //query is not a number -> author name, title
        const books = await Book.find({$or: [ { author: query }, { name: query } ]})
        if(books.length === 0){
            return res.status(404).json({
                "status": "failure",
                "msg" : "Books Not Found!",
                books : null
            })
        }
        res.status(200).json({
            "status": "success",
            "msg" : "Books found",
            books
        })
    }
    else{
        // query is a number -> it can be a title or yop
        const books = await Book.find({$or: 
                [ 
                    { name: {$eq : query} }, 
                    { yop: {$eq : queryNumber} }
                ]
            }
        )
        if(books.length === 0){
            return res.status(404).json({
                "status": "failure",
                "msg" : "Books Not Found!",
                books : null
            })
        }
        res.status(200).json({
            "status": "success",
            "msg" : "Books found",
            books
        })
    }
})