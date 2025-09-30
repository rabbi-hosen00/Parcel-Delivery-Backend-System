/* eslint-disable no-console */
import { Server } from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";
import { sendAdmin } from "./utils/sendAdmin";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;



const startServer = async () => {
    try {
        console.log(envVars.NODE_ENV)
        await mongoose.connect(envVars.DB_URL)

        console.log("connected to database!!")

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listing to port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

(async () => {
   await startServer()
   await sendAdmin()
})()

process.on("SIGTERM", (err) => {
    console.log("SIGTERM  SIGNAL RECIVED.... server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
        process.exit(1)
    }
})

process.on("unhandledRejection", (err) => {
    console.log("unhandle Rejection detected.... server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
        process.exit(1)
    }
})


process.on("uncaughtException", (err) => {
    console.log(" uncaught Exception detected.... server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
        process.exit(1)
    }
})





//unhandle rejection erroe
// Promise.reject(new Error("I forget to catch this promise"))


//uncaught expection error
// throw new Error(" i forgot to handle this local error")



/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */
