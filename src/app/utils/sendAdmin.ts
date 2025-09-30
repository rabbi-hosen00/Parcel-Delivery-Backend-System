
import bcryptjs  from 'bcryptjs';
import { envVars } from "../config/env"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"




 export const sendAdmin = async() =>{

    try {
        const isAdminExist = await User.findOne({email: envVars.ADMIN_EMAIL})

        if(isAdminExist){
            console.log("admin already exist!")
            return
        }

        console.log("Trying to created admin")

        const hashedPassword = await bcryptjs.hash(envVars.ADMIN_PASSWORD,Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider:IAuthProvider = {
            provider: "credentials",
            providerId: envVars.ADMIN_EMAIL
        }

        const paylod:IUser ={
            name: "ADMIN",
            role: Role.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hashedPassword,
            auths: [authProvider],
            isBlocked: false
        }

        const admin = await User.create(paylod)
        console.log(" admin creaded successfully!\n")
        console.log(admin)

    } catch (error) {
        console.log(error)
    }
}