import { model, Schema, Types } from "mongoose";
import { IAuthProvider, IUser, Role } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true }, // e.g., "google", "facebook"
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})



const userSchema = new Schema<IUser>({

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    picture: {
        type: String,
        default: "", // optional profile picture
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.SENDER,
        
    },
    auths: [authProviderSchema],
    sentParcels: [
        {
            type: Types.ObjectId,
            ref: "Parcel",
        },
    ],
    receivedParcels: [
        {
            type: Types.ObjectId,
            ref: "Parcel",
        },
    ],
},
    {
        timestamps: true,
        versionKey: false
    })



export const User = model<IUser>("User", userSchema)


