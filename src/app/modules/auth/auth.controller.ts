/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from './auth.service';
import AppError from '../../errorHelpers/appError';
import { setAuthCookie } from '../../utils/setCooke';


const credeentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body)


    setAuthCookie(res,loginInfo)

    sendResponse(res, {
        success : true,
        statuCode: httpStatus.CREATED,
        message : "User Login successfully",
        data: loginInfo,
    })

    
})



const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, "No refress token recived from cookies ")
    }

    // const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

     const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    setAuthCookie(res, tokenInfo )

    sendResponse(res, {
        success : true,
        statuCode: httpStatus.CREATED,
        message : "New Access Token Retrived successfully",
        data: tokenInfo,
    })

    
})



const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   

    sendResponse(res, {
        success : true,
        statuCode: httpStatus.CREATED,
        message : "User Login successfully",
        data: tokenInfo,
    })

    
})

export const AuthControllers = {
    credeentialLogin,
    getNewAccessToken,
}
