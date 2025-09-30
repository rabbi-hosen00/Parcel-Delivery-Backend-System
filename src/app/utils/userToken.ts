import  httpStatus  from 'http-status-codes';
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import AppError from '../errorHelpers/appError';
import { JwtPayload } from 'jsonwebtoken';


export const createUserToken =(user: Partial<IUser>) =>{
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESS_SECRET,envVars.JWT_REFRESS_EXPIRES)
    
    return {
        accessToken,
        refreshToken
    }
}


export const createNewAccessTokenWithRefreshToken = async (refreshToken : string) =>{
  const verifiedrefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESS_SECRET) as JwtPayload;

   
    const isUserExist = await User.findOne({ email : verifiedrefreshToken.email })


    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email doesn't exist!!")
    }

     if (isUserExist.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, "user is blocked!!")
    }


      const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)


    return{
        accessToken
    }

}

