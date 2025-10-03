import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoutes } from "../modules/auth/auth.route"
import { StatusLogsRoutes } from "../modules/statusLogs/statusLogs.route"
import { ParcelRoutes } from "../modules/percel/percel.route"

export const router = Router()

 const moduleRoutes = [
    {
        path:"/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/StatusLogs",
        route: StatusLogsRoutes
    },
    {
        path: "/parcels",
        route: ParcelRoutes
    }
]


moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})


