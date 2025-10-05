
import { StatusLogs } from "./statusLogs.model";



// const createStatusLogs = async(payload:IStatusLogs) =>{
 
 
 
//     const statusLogs = await StatusLogs.create(payload)
//     return statusLogs

// }


const getAllStatus = async()=>{
    const statusLogs = await StatusLogs.find({});
    const totalStatusLogs = await StatusLogs.countDocuments();

    return{
        data:statusLogs,
        meta : {
            total: totalStatusLogs
        }
    }
}


const getSingleStatusLog = async(statusId : string) =>{
    const statusLog = await StatusLogs.findById(statusId)
     
    return{
        data : statusLog
    }
}






export const statusLogservice ={
    // createStatusLogs,
    getAllStatus,
    getSingleStatusLog
}