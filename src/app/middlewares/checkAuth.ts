import httpStatus from 'http-status-codes';
import AppError from "../errorHelpers/appError"
import { envVars } from '../config/env';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import { User } from '../modules/user/user.model';





export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    {

        try {
            const accessToken = req.headers.authorization

            if (!accessToken) {
                throw new AppError(httpStatus.BAD_REQUEST, "No Token Recived")
            }

            const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

            const isUserExist = await User.findOne({ email: verifiedToken.email })


            if (!isUserExist) {
                throw new AppError(httpStatus.BAD_REQUEST, "Email doesn't exist!!")
            }

            const targetUserId = req.params.id; // শুধু param থেকে
            if (targetUserId && isUserExist.role === "ADMIN" && isUserExist._id.toString() === targetUserId) {
                throw new AppError(httpStatus.FORBIDDEN, "Admin cannot block/unblock themselves");
            }
            if (isUserExist.isBlocked) {
                throw new AppError(httpStatus.BAD_REQUEST, "User is blocked. Please contact the admin!!")
            }

            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(httpStatus.FORBIDDEN, "You are not permited to view route")
            }
            req.user = verifiedToken
            next()

        } catch (error) {
            next(error)
        }

    }
}


