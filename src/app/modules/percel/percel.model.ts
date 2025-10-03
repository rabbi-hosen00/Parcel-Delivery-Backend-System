import { model, Schema } from "mongoose";
import { IParcel, ParcelStatus } from "./percel.interface";




const ParcelSchema = new Schema({
  trackingId: {
    type: String,
    unique: true,
    index: true
  },
  type: String,
  weight: Number,
  fee: Number,
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
 receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  pickupAddress: String,
  deliveryAddress: String,
  status: { type: String, enum: Object.values(ParcelStatus), default: ParcelStatus.REQUESTED, index: true },
  statusLogs: [{
    type: Schema.Types.ObjectId,
    ref: "StatusLogs",
    required: true
  }],
  isFlagged: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
},
  {
    timestamps: true,
    versionKey: false
  });

// Compound index example: find parcels of a sender by status quickly
ParcelSchema.index({ sender: 1, status: 1, createdAt: -1 });

export const Parcel = model<IParcel>("Parcel", ParcelSchema)

