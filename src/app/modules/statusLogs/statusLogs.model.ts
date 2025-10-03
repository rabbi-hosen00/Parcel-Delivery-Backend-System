import { model, Schema } from "mongoose";
import { IStatusLogs } from "./statusLogs.interface";
import { ParcelStatus } from "../percel/percel.interface";




const statusLogschema = new Schema({
  status: { type: String, enum: Object.values(ParcelStatus), required: true },
  location: String,
  note: String,
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { 
    timestamps : true,
    versionKey: false
});


export const StatusLogs = model<IStatusLogs>("StatusLogs",statusLogschema)




