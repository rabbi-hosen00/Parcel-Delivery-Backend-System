import { Types } from "mongoose";



export enum ParcelStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  DISPATCHED = "DISPATCHED",
  IN_TRANSIT = "IN_TRANSIT",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  HELD = "HELD",
  BLOCKED= "BLOCKED"
}





export interface IParcel {
  _id?: Types.ObjectId;
  trackingId: string;     // TRK-YYYYMMDD-xxxxxx
  type?: string;          // e.g., documents, parcel
  weight?: number;
  quantity: number;       
  fee?: number;
  sender: Types.ObjectId;   // ref User
  receiver: Types.ObjectId;    // optional ref if receiver has account
  pickupAddress: string;
  deliveryAddress: string;
  status: ParcelStatus;
  statusLogs?: Types.ObjectId[]; // embedded
  isFlagged?: boolean;
  isBlocked?: boolean;
}









