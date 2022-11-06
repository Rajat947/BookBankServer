const mongoose = require('mongoose');

const User = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,      
    },
     email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true,
        select: false,
    },
    passwordConfirm:{
        type:String,
        required:true,
        select: false
    },
    admin:{
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model('User', User);