
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatusLogsController } from "./statusLogs.controllers";


const router = Router();



router.get(
  "/",
  checkAuth(Role.ADMIN), 
  StatusLogsController.getAllStatus
)

router.get("/:statusId",StatusLogsController.getSingleStatusLog);





export const StatusLogsRoutes = router



