const app = require('./app')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const db = require('./config/db');
dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, (err)=>{
    if(!err)
        console.log(`📚 Library Management App is Running on port ${PORT}`);
    else console.log(err);
});

//DB CONNECTION
db();

process.on('unhandledRejection', function(err){
    console.log(`Error Occured`, err.message);
    console.log(`Unhandled Rejection ❌ Shutting Down Server`);
    server.close(() => {
        process.exit(1);
    });
});
process.on('uncaughtException', function(err){
    console.log(`Error Occured`, err.message);
    console.log(`Unhandled Exception ❌ Shutting Down Server`);
    server.close(() => {
        process.exit(1);
    });
});
