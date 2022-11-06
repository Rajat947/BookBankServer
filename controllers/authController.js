const User = require("../models/user");
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {promisify} = require('util');

// const filterBody = function(body, ...fields){
//     const bodyNew = {};
//     Object.keys(body).forEach(el => {
//         if(fields.includes(el)){
//             bodyNew[el] = body[el];
//         }
//     });
//     return bodyNew;
// }

module.exports.signup = catchAsync(async function(req, res, next){
    const filteredObj = {
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
    }
    const newUser = await User.create(filteredObj);
    const token = await jwt.sign({id:newUser._id}, process.env.SECRET,{
        expiresIn:process.env.EXPIRES_IN
    });
    res.cookie('access-token', token);
    res.status(200).json({
        status:"success",
        token
    })
    
});
module.exports.login = catchAsync(async function(req,res,next){
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    //Checking if email and password exists
    if(!email || !password){
        return next(new AppError('Please Provide Authentication Details',400));
    }
    const user = await User.findOne({email:email}).select('+password');
    //checking if user exists , and provided correct details then send the token
    if(!user || !(user.password === password)){
        return next(new AppError('Incorrect Email or Password', 400));
    }
    // sending the token
    const token = await jwt.sign({id:user._id}, process.env.SECRET,{
        expiresIn:process.env.EXPIRES_IN
    });
    res.cookie('access-token', token);
    return res.status(200).json({
        status:"success",
        token
    })
});

module.exports.protect = catchAsync(async function(req,res,next){
    let token;
    //checking if there is any token in header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies['access-token']){
        token = req.cookies['access-token'];
    }
    if(!token){
        return next(new AppError('Not Authorized! Please Login, Try Again', 401));
    }
    //verification
    const decodedPayload = await promisify(jwt.verify)(token, process.env.SECRET);

    //checking if user still exists or not! in db
    const freshUser = await User.findById(decodedPayload.id)
    if(!freshUser)
    {
        return next(new AppError('The User belonging to the token doesnt exists!', 401))
    }
    req.user = freshUser;
    res.cookie("access-token", token);
    next();
});
module.exports.adminOnly = function(){
    return (req,res,next) => {
        if(!req.user.admin){
            return next(new AppError('Not Authorized!', 403));
        }
        next();
    }
}
