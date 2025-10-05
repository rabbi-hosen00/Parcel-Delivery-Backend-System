/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import { IParcel, ParcelStatus } from "./percel.interface";
import { Parcel } from "./percel.model";
import { StatusLogs } from '../statusLogs/statusLogs.model';



const createPercel = async (payload: IParcel) => {
    const existingPercel = await Parcel.findOne({ trackingId: payload.trackingId })

    if (existingPercel) {
        throw new Error("This parcel is already exists")
    }

    const parcel = await Parcel.create(payload)

    const initialLog = await StatusLogs.create({
        status: ParcelStatus.REQUESTED,
        location: parcel.pickupAddress,
        note: "Parcel requested by sender",
        updatedBy: parcel.sender
    });

    parcel.statusLogs = parcel.statusLogs || [];
    parcel.statusLogs.push(initialLog._id);
    await parcel.save();

    return parcel.populate("statusLogs", "status location note");

}

const getAllParcel = async (filters: any, options: any) => {

    const query: any = {}


    if (filters?.status) {
        query.status = filters.status
    }

    if (filters?.sender) {
        query.sender = filters.sender;
    }
    if (filters?.receiver) {
        query.receiver = filters.receiver;
    }


    const limit = Number(options.limit) || 10;
    const page = Number(options.page) || 1;
    const skip = (page - 1) * limit;
    const sort = options.sort || "-createdAt";


    const parcels = await Parcel.find(query)
        .populate("sender", "name email")
        .populate("receiver", "name email")     // receiver info
        .populate("statusLogs","status location note")
        .sort(sort)
        .skip(skip)
        .limit(limit)

    const total = await Parcel.countDocuments(query)

    return {
        meta: {
            total,
            page,
            limit
        },
        data: parcels
    }

}





const getMyParcelByEmail = async (email: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found with this email")
    }

    const parcel = await Parcel.find({ sender: user._id })
        .populate("sender", "name")
        .populate("receiver", "name email")
        .populate("statusLogs", "status location note")
        .sort({ createdAt: -1 });

    const totalParcel = await Parcel.countDocuments()

    return {
        data: parcel,
        meta: {
            total: totalParcel
        }
    }
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cancelParcel = async (parcelId: string, senderId: any) => {
    const parcel = await Parcel.findById(parcelId)
        .populate("statusLogs")

    if (!parcel) {
        throw new Error("Parcel not found");
    }

    if (parcel.sender.equals(senderId)) {
        throw new Error("You are not authorized to cancel this parcel");
    }

    const forbiddenStatus = [
        ParcelStatus.DISPATCHED,
        ParcelStatus.IN_TRANSIT,
        ParcelStatus.OUT_FOR_DELIVERY,
        ParcelStatus.DELIVERED
    ];

    if (forbiddenStatus.includes(parcel.status)) {
        throw new Error("Parcel cannot be cancelled as it has already been dispatched");
    }

    parcel.status = ParcelStatus.CANCELLED;

    // await parcel.save();
    return parcel

}




export const ParcelService = {
    createPercel,
    getMyParcelByEmail,
    cancelParcel,
    getAllParcel
}


