
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./percel.service";
import _dayjs from "dayjs";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from 'http-status-codes';




const createPercel = catchAsync(async (req: Request, res: Response) => {

    const randomSix = Math.floor(100000 + Math.random() * 900000);
     const trackingId = `TRK-${_dayjs().format("YYYYMMDD")}-${randomSix}`;

      const payload = { ...req.body, trackingId };


    const result = await ParcelService.createPercel(payload)

    sendResponse(res,{
        statusCode: httpStatus.CREATED,
        success: true,
        message:"Percel Created Successfully",
        data: result
    })


})





export const ParcelController ={
    createPercel,
}

