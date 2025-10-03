
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { StatusLogsZodSchema } from "./statusLogs.validation";
import { StatusLogsController } from "./statusLogs.controllers";


const router = Router();


router.post(
  "/create",
  checkAuth(Role.ADMIN),
  validateRequest(StatusLogsZodSchema),
  StatusLogsController.createStatusLogs
)


router.get(
  "/",
  checkAuth(Role.ADMIN), 
  StatusLogsController.getAllStatus
)

router.get("/:statusId",StatusLogsController.getSingleStatusLog);





export const StatusLogsRoutes = router



