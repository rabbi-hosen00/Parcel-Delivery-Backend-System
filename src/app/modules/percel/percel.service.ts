/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
        .populate("statusLogs", "status location note")
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




export const cancelParcel = async (parcelId: string, senderId: string) => {
    // Step 1: Find parcel
    const parcel = await Parcel.findById(parcelId).populate("statusLogs");

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }


    // Step 3: Check forbidden statuses
    const forbiddenStatus = [
        ParcelStatus.DISPATCHED,
        ParcelStatus.IN_TRANSIT,
        ParcelStatus.OUT_FOR_DELIVERY,
        ParcelStatus.DELIVERED
    ];

    if (forbiddenStatus.includes(parcel.status)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel cannot be cancelled as it has already been dispatched");
    }

    // Step 4: Update parcel status
    parcel.status = ParcelStatus.CANCELLED;

    // Step 5: Create a status log
    const cancelLog = await StatusLogs.create({
        status: ParcelStatus.CANCELLED,
        location: parcel.pickupAddress,
        note: "Parcel cancelled by sender",
        updatedBy: senderId,
    });

    // Step 6: Push log to parcel
    if (!parcel.statusLogs) {
        parcel.statusLogs = [];
    }
    parcel.statusLogs.push(cancelLog._id);

    // Step 7: Save parcel
    await parcel.save();

    // Step 8: Populate and return
    return await parcel.populate("statusLogs", "status location note")
};



const updateParcelStatus = async (parcelId: string, newStatus: ParcelStatus, location: string, adminId: string) => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) throw new Error("Parcel not found");

    if (parcel.status === newStatus) {
        throw new Error(`Parcel is already in status: ${newStatus}`);
    }


    parcel.status = newStatus;


    const newStatusLog = await StatusLogs.create({
        status: newStatus,
        location: location,
        note: `Status updated to ${newStatus} by admin`,
        updatedBy: adminId,
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parcel.statusLogs!.push(newStatusLog._id);

    await parcel.save();

    return {
        trackingId: parcel.trackingId,
        newStatus: parcel.status,
        location: location,
        message: `Parcel status updated to ${newStatus}`,
    };
};


const getParcelStatusLogs = async (parcelId: string) => {

    const parcel = await Parcel.findById(parcelId)
        .populate({
            path: "statusLogs",
            select: "status note location updatedBy createdAt -_id", // শুধু দরকারি ফিল্ড দেখাবে
            populate: {
                path: "updatedBy",
                select: "name role",
            },
        })
        .select("trackingId status statusLogs");


    return {
        trackingId: parcel!.trackingId,
        currentStatus: parcel!.status,
        statusLogs: parcel!.statusLogs,
    };
};



const getIncomingParcelsForReceiver = async (receiverId: string) => {

    const visibleStatuses = [
        "APPROVED",
        "DISPATCHED",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "RETURNED",
        "HELD",
    ];


    const parcels = await Parcel.find({
        receiver: receiverId,
        status: { $in: visibleStatuses }
    })
        .populate("sender", "name email")
        .select("trackingId  type quantity fee status statusLogs  deliveryAddress createdAt");

    const total = await Parcel.countDocuments({
        receiver: receiverId, // ✅ শুধুমাত্র ওই receiver-এর parcel গুনবে
        status: { $in: visibleStatuses }
    });
    return {
        meta: {
            total
        },
        parcels
    };
}


const confirmParcelDelivery = async (parcelId: string, receiverId: string) => {

    const parcel = await Parcel.findById(parcelId);

    console.log(parcel)

    if (!parcel) {
        throw new Error("Parcel not found");
    }
    if (parcel.receiver.toString() !== receiverId) {
        throw new Error("You are not authorized to confirm this parcel");
    }
    if (parcel.status === "DELIVERED") {
        throw new Error("The parcel is already confirmed by the receiver")
    }

    if (
        [ParcelStatus.BLOCKED, ParcelStatus.CANCELLED, ParcelStatus.RETURNED].includes(parcel.status)
    ) {
        throw new Error(`Parcel cannot be confirmed because its status is ${parcel.status}`);
    }

    const statusLog = await StatusLogs.create({
        status: ParcelStatus.DELIVERED,
        note: "Receiver confirmed delivery",
        updatedBy: receiverId,
        location: parcel.deliveryAddress,
    });

    // update parcel status and push statusLog
    parcel.status = ParcelStatus.DELIVERED;
    parcel.statusLogs!.push(statusLog._id);
    await parcel.save();

    return {
        trackingId: parcel.trackingId,
        status: parcel.status,
        lastStatusLog: statusLog,
    };

}



const getReceiverDeliveryHistory = async (receiverId: string) => {
    const history = await Parcel.find({
        receiver: receiverId,
        status: {
            $in: [
                ParcelStatus.DELIVERED,
                ParcelStatus.RETURNED,
                ParcelStatus.CANCELLED
            ]
        },
    })
        .populate("sender", "name email") // sender info
        .select("trackingId type fee status deliveryAddress updatedAt"); // selected fields only

    return history;
};



export const ParcelService = {
    createPercel,
    getMyParcelByEmail,
    cancelParcel,
    getAllParcel,
    updateParcelStatus,
    getParcelStatusLogs,
    getIncomingParcelsForReceiver,
    confirmParcelDelivery,
    getReceiverDeliveryHistory
}


