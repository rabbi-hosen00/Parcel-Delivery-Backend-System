
import { NextFunction } from 'express';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from '../../utils/catchAsync';

import { sendResponse } from '../../utils/sendResponse';
import { verifyToken } from '../../utils/jwt';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';





const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserService.createUserService(req.body)

    sendResponse(res, {
        success : true,
        statuCode: httpStatus.CREATED,
        message : "User created successfully",
        data: user,
    })

    // res.status(httpStatus.CREATED).json({
    //     message: "User created successfully",
    //     user
    // })
})


const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user

    const payload = req.body

    const user = await UserService.updateUser(userId, payload, verifiedToken)


    sendResponse(res, {
        success : true,
        statuCode: httpStatus.CREATED,
        message : "User Updated successfully",
        data: user,
    })

    // res.status(httpStatus.CREATED).json({
    //     message: "User created successfully",
    //     user
    // })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await UserService.getAllUsers()
   
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully ",
    //     data: users
    // })

    sendResponse(res, {
        success : true,
        statuCode: httpStatus.CREATED,
        message : "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})



export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}


