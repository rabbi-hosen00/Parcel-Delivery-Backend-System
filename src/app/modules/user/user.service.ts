import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';




const createUserService = async (payload: Partial<IUser>) => {
    const { email, password, role, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "user already exist!!")
    }

    const hashedPassword = await bcryptjs.hash(password as string, 10)
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        role: role || Role.SENDER,
        ...rest
    })
    return user

}


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    /**
     * email - can not update
     * name, phone, password address
     * password - re hashing
     *  only admin admin - role, isBlocked...
     * 
     * promoting to admin - admin
     */

    if (payload.role) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }

        if (payload.role === Role.ADMIN && decodedToken.role !== Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "Only Admins can perform this action");
        }

        if (payload.isBlocked) {
            if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
                throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
            }
        }

        if (payload.password) {
            payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}


const getAllUsers = async () => {
    const users = await User.find({})

    const totalUsers = await User.countDocuments()

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}


const blockUser = async (userId: string) => {
    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    user.isBlocked = true;
    await user.save();

    return user

}


const unblockUser = async(userId : string) =>{
    const isExistUser = await User.findById(userId);

    if(!isExistUser){
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    isExistUser.isBlocked = false;
    isExistUser.save()

    return isExistUser;

}




export const UserService = {
    createUserService,
    getAllUsers,
    updateUser,
    blockUser,
    unblockUser
}