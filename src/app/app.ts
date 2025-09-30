
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

import express, { Application,  Request, Response } from "express"
import cors from "cors"
import { router } from "./routes"
import { globalErrorHandalers } from "./middlewares/globalErrorHandalers"
import notFound from "./middlewares/notFound";
import cookieParser from "cookie-parser";

const app: Application = express()


app.use(cookieParser())
app.use(express.json())
app.use(cors())



app.use("/api/v1", router)


app.get('/', (req: Request, res: Response) => {
   res.status(200).json({
      message: "Parcel Delivery BACKEND SYSTEM"
   })
})



app.use(globalErrorHandalers)

app.use(notFound)

export default app;


