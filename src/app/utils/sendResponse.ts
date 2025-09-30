import { Response } from "express";


interface TMeta{
    total: number
}

interface TResponse<T>{
    statuCode : number;
    success : boolean;
    message: string;
    data: T;
    meta?: TMeta
}


export const sendResponse =<T> (res:Response, data:TResponse<T>)  => {

    res.status(data.statuCode).json({
        StatusCodes: data.statuCode,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
    })


}