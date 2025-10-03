/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"
import { object } from "zod"
import { issue } from "zod/v4/core/util.cjs"

export const globalErrorHandalers = (err: any, req: Request, res: Response, next: NextFunction) => {

    const errorSources: any = []
    let statusCode = 500
    let message = "Something Went Wrong!!"

    // duplicate error
    if (err.code === 11000) {
        const matchedArray = err.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${matchedArray[1]} already exists`
    }
    // Cast Error
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid Mongodb objectID, Please Provide a valid id"
    }
     else if(err.name === "ZodError"){
        statusCode = 400;
        message = "zod Error"
        console.log(err.issues) 
        err.issues.forEach((issue : any) =>{
            errorSources.push({
                path: issue.path[issue.path.length - 1],
                message: issue.message
            })
        })
     }
    //mongoose validation error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors);

        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: "Cast Failed"
        }))
        // console.log(errorSources);
        message = "Validation Error"
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
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}





