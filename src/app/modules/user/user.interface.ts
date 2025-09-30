import { Types } from "mongoose";

export enum Role{
    ADMIN = "ADMIN",
    SENDER ="SENDER",
    RECEIVER = "RECEIVER"
}


export interface IAuthProvider{
    provider: "google" | "credentials";
    providerId: string
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    picture?: string;
    isBlocked?: boolean; 
    // isActive?: string;
    role: Role; 
    auths?: IAuthProvider[];
    sentParcels?: Types.ObjectId[];   // IDs of parcels created (for sender)
    receivedParcels ?: Types.ObjectId[]; // IDs of parcels to be received (for receiver)
}










