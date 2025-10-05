
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"
import { object } from "zod"
import { issue } from "zod/v4/core/util.cjs"
import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose"
import { handlerDuplicateError } from "../helpers/handlerDuplicateError"
import { handleCastError } from "../helpers/handleCastError"
import { handleZodError } from "../helpers/handleZodError"
import { handleValidationError } from "../helpers/handleValidationError"






export const globalErrorHandalers = (err: any, req: Request, res: Response, next: NextFunction) => {

    if(envVars.NODE_ENV === "development"){
        console.log(err)
    }



    let errorSources: any = []
    let statusCode = 500
    let message = "Something Went Wrong!!"

    // duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Zod Error
    else if (err.name === "ZodError") {
         const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
       
    }

    //mongoose validation error
    else if (err.name === "ValidationError") {

        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        // console.log(errorSources);
        message = simplifiedError.message;
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err : envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}








