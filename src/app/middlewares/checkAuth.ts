import httpStatus from 'http-status-codes';
import AppError from "../errorHelpers/appError"
import { envVars } from '../config/env';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';




export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    {

        try {
            const accessToken = req.headers.authorization

            if (!accessToken) {
                throw new AppError(httpStatus.BAD_REQUEST, "No Token Recived")
            }

            const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

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
