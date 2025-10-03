/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import { statusLogservice } from './statusLogs.service';



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createStatusLogs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await statusLogservice.createStatusLogs(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "StatusLogs Created Successfully",
        data: result
    })
})



export const getAllStatus = async (req: Request, res: Response) => {
    try {
        const result = await statusLogservice.getAllStatus();

        // success response
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Satus Logs history retrieved successfully",
            meta: result.meta,
            statusLogs: result.data,  // Status Logss
            // pagination or metadata
        });
    } catch (error: any) {
        console.error("Error fetching Status Logss:", error);

        // error response
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve Status Logss",
            error: error.message || error,
        });
    }
};



export const getSingleStatusLog = async (req: Request, res: Response) => {
  
     const { statusId } = req.params;

    try {
        const result = await statusLogservice.getSingleStatusLog(statusId);

        // success response
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Satus Logs history retrieved successfully",
            statusLog: result.data,  // Status Logss
            // pagination or metadata
        });
    } catch (error: any) {
        console.error("Error fetching Status Logss:", error);

        // error response
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve Status Logss",
            error: error.message || error,
        });
    }
};





export const StatusLogsController = {
    createStatusLogs,
    getAllStatus,
    getSingleStatusLog
}


