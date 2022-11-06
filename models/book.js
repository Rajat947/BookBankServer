const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '----Not available----'
    },
    copies: {
        type: Number,
        min:1,
        required: true
    },
    yop:{
        type:Number,
        min:1
    },
    slug: String
});
// bookSchema.pre('save', function (next) {
//     this.slug = slug(this.todos.$.task);
//     next();
// });


module.exports=mongoose.model('Book',bookSchema);