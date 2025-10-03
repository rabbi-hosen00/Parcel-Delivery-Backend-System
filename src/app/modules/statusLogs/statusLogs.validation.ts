


import { z } from "zod";
import { ParcelStatus } from "../percel/percel.interface";

export const StatusLogsZodSchema = z.object({
  status: z
  .enum(Object.values(ParcelStatus) as [string, ...string[]])
  .default(ParcelStatus.REQUESTED), // required, must be valid enum
  location: z.string().optional(),
  note: z.string().optional(),
  updatedBy: z.string().optional(), // ObjectId as string (can refine later)
});



export const updatedStatusLogsZodSchema = z.object({
  status: z
    .enum(Object.values(ParcelStatus) as [string, ...string[]])
    .optional(),  

  location: z.string().optional(), 

  note: z.string().optional(),

  updatedBy: z.string().optional(),
});







