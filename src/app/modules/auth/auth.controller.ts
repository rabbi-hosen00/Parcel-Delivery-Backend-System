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
        statusCode: httpStatus.CREATED,
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
        statusCode: httpStatus.CREATED,
        message : "New Access Token Retrived successfully",
        data: tokenInfo,
    })

    
})



const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })


    sendResponse(res, {
        success : true,
        statusCode: httpStatus.CREATED,
        message : "User Logged out successfully",
        data: null,
    })

    
})


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   
    
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

     await AuthServices.resetPassword(oldPassword, newPassword,decodedToken)


    sendResponse(res, {
        success : true,
        statusCode: httpStatus.CREATED,
        message : "Password Changed Successfully",
        data: null,
    })

    
})

export const AuthControllers = {
    credeentialLogin,
    getNewAccessToken,
    logout,
    resetPassword
}
