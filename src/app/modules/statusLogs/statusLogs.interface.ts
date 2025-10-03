import { Types } from "mongoose";
import { ParcelStatus } from "../percel/percel.interface";




export interface IStatusLogs {
  status: ParcelStatus;
  location?: string;      // optional text or GPS coords
  note?: string;
  updatedBy?: Types.ObjectId; // user/admin who updated
}

