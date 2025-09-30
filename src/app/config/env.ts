import dotenv from "dotenv";

dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    JWT_ACCESS_SECRET: string,
    JWT_ACCESS_EXPIRES: string,
    BCRYPT_SALT_ROUND: string,
    ADMIN_EMAIL: string,
    ADMIN_PASSWORD: string,
    JWT_REFRESS_SECRET: string,
    JWT_REFRESS_EXPIRES: string,
}


const loadEnvVariables = (): EnvConfig => {

    const requiredEnvVariables : string [] = ["PORT","DB_URL","NODE_ENV","JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES","BCRYPT_SALT_ROUND","ADMIN_EMAIL","ADMIN_PASSWORD","JWT_REFRESS_EXPIRES",
        "JWT_REFRESS_EXPIRES","JWT_REFRESS_SECRET",
    ];

    requiredEnvVariables.forEach(key =>{
        if(!process.env[key]){
            throw new Error(`missing require environment variable ${key}`)
        }

    })

    return  {
    PORT: process.env.PORT as string ,
    DB_URL: process.env.DB_URL as string ,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESS_SECRET: process.env.JWT_REFRESS_SECRET as string,
    JWT_REFRESS_EXPIRES: process.env.JWT_REFRESS_EXPIRES as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,

}
}


export const envVars = loadEnvVariables()




