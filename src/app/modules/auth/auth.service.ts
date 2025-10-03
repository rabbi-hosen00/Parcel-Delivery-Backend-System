/* eslint-disable @typescript-eslint/no-non-null-assertion */

import httpStatus from 'http-status-codes';
import { IUser } from "../user/user.interface"
import AppError from '../../errorHelpers/appError';
import bcryptjs from "bcryptjs"
import { User } from '../user/user.model';
import { createNewAccessTokenWithRefreshToken, createUserToken } from '../../utils/userToken';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';




const credentialsLogin = async (payload: Partial<IUser>) => {

    const { email, password } = payload

    const isUserExist = await User.findOne({ email })


    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "user doesn't exist!!")
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }


    const userToken = createUserToken(isUserExist)


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject()

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    }

}




const getNewAccessToken = async (refreshToken: string) => {

    const { accessToken } = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken
    }
}


const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password doesn't match ")
    }


    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save()


}


export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}
