


import { z } from "zod";
import { ParcelStatus } from "./percel.interface";
import { StatusLogsZodSchema } from "../statusLogs/statusLogs.validation";


export const createParcelZodSchema = z.object({
  trackingId: z.string().min(1, "trackingId is required").optional(), // e.g., TRK-YYYYMMDD-xxxxxx
  type: z.string().optional(),                            // documents, parcel
  weight: z.number().positive("Weight must be positive").optional(),
  quantity: z.number().positive("Quantity must be positive").optional(),
  fee: z.number().nonnegative("Fee must be >= 0").optional(),

  sender: z.string().min(1, "Sender ObjectId is required"), // later you can refine for ObjectId
  receiver: z.string().min(1, "Sender ObjectId is required"),

  pickupAddress: z.string().min(5, "Pickup address is required"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),

  status: z
    .enum(Object.values(ParcelStatus) as [string, ...string[]])
    .default(ParcelStatus.REQUESTED),

   statusLogs: z
  .union([z.string().min(1), z.array(z.string().min(1))])
  .optional(),// here you can replace z.any() with StatusLogsZodSchema later

  isFlagged: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});





export const updateParcelZodSchema = z.object({
  trackingId: z.string().min(1, "StatusId is required").optional(),

  type: z.string().optional(),

  weight: z.number().positive("Weight must be positive").optional(),

  fee: z.number().nonnegative("Fee must be >= 0").optional(),

  sender: z.string().optional(),

  receiver: z.string().optional(),

  pickupAddress: z.string().min(5, "Pickup address is required").optional(),

  deliveryAddress: z.string().min(5, "Delivery address is required").optional(),

  status: z.enum(Object.values(ParcelStatus) as [string, ...string[]]).optional(),

  statusLogs: z.array(StatusLogsZodSchema).optional(),

  isFlagged: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});




