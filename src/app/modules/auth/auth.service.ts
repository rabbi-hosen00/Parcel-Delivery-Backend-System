
import httpStatus from 'http-status-codes';
import { IUser } from "../user/user.interface"

import AppError from '../../errorHelpers/appError';
import bcryptjs from "bcryptjs"
import { User } from '../user/user.model';
import { createNewAccessTokenWithRefreshToken, createUserToken } from '../../utils/userToken';



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
    const {password : pass, ...rest } = isUserExist.toObject()

    return {
        accessToken : userToken.accessToken,
        refreshToken : userToken.refreshToken,
        user : rest
    }

}




const getNewAccessToken = async (refreshToken: string) => {

    const { accessToken } = await createNewAccessTokenWithRefreshToken(refreshToken)
  
      return {
        accessToken
    }

}


export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}
