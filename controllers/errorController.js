const sendErrProd = (res,err) => {
    console.log(`❌ Error Occured ->`,err.message);
    if(err.isOperational){
        res.status(err.statusCode).json({
            status : err.status,
            error : {
                message : err.message
            }
        });
    }
    else
    {
        res.status(500).json({
            status : 'Error',
            message : "Internal Server Error" 
        });
        
    };
}

const sendErrDev = (res,err) => {
    console.log(`❌ Error Occured ->`,err.message);
    res.status(err.statusCode).json({
        status : err.status,
        message:err.message,
        error : err,
        stack : err.stack
    });
}
module.exports.globalErrorHandlingMWare = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development'){
        sendErrDev(res,err);
    }
    else if(process.env.NODE_ENV === 'production'){
        sendErrProd(res,err);
    }
}