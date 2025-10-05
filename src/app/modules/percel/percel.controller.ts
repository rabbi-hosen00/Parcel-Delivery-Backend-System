
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./percel.service";
import _dayjs from "dayjs";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/appError";




const createPercel = catchAsync(async (req: Request, res: Response) => {
    const randomSix = Math.floor(100000 + Math.random() * 900000);
    const trackingId = `TRK-${_dayjs().format("YYYYMMDD")}-${randomSix}`;

    const payload = { ...req.body, trackingId };


    const result = await ParcelService.createPercel(payload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Percel Created Successfully",
        data: result
    })


})


const getAllParcel = catchAsync(async (req: Request, res: Response) => {
    const filters = {
        status: req.query.status,
        sender: req.query.sender,
        receiver: req.query.receiver
    }

    const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort
    };


    const result = await ParcelService.getAllParcel(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Parcels retrieved successfully",
        meta: result.meta,
        data: result.data
    })


})



const getMyParcelByEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const email = req.user.email;

    if (!email) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email not found in request")
    }


    const result = await ParcelService.getMyParcelByEmail(email)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Parcels fetched successfully",
        meta: result.meta,
        data: result.data,

    })

})


const cancelMyParcel = catchAsync(async (req: Request, res: Response) => {

    const parcelId = req.params.id;
    const senderId = req.user._id;

    const updateParcel = await ParcelService.cancelParcel(parcelId, senderId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Parcel cancelled successfully",
        data: updateParcel
    });


})






export const ParcelController = {
    createPercel,
    getMyParcelByEmail,
    cancelMyParcel,
    getAllParcel
}

