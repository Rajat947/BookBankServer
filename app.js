const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errController = require('./controllers/errorController');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const issueRouter = require('./routes/issueRoutes');


const app = express();


//middlewares
//1. request logger
if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));
//2. body parser
app.use(bodyParser.json());
//3. Cookie Parser
// app.use(cookieParser());
//routes
app.use('/api/books',bookRouter);
app.use('/api/users',userRouter);
app.use('/api/issues',issueRouter);


//global error handling middleware
app.use(errController.globalErrorHandlingMWare);

// Not found any matching url ->
app.all("*",function(req,res,next){
    res.status(404).json({
        "status" : "failure",
        "data" : null
    });
});
module.exports = app;