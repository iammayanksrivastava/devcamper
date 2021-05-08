

const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {

    let error = {...err}

    error.message = err.message

    console.log(err)

//Mongoose bad object ID 
    if(err.name === 'CastError') {
        const message = `Resource not found with id ${err.value}`
        error = new ErrorResponse(message, 404); 
    }


//Mongoose Duplicate Key 

    if (err.code === 11000) {
        const message = `Resource already exists. Duplicate Value`
        error = new ErrorResponse(message, 400)
    }

//Mongoose Validaton Error 

    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message); 
        error = new ErrorResponse(message,400)
    }

    res.status(error.statusCode || 500).json({
        success: false, 
        error: error.message || 'Server ERROR'
    })
}


module.exports = errorHandler