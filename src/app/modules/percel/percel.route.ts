import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { validateRequest } from '../../middlewares/validateRequest';
import { createParcelZodSchema } from './percel.validation';
import { ParcelController } from './percel.controller';




const router = Router();

router.post("/",checkAuth(Role.SENDER),validateRequest(createParcelZodSchema),ParcelController.createPercel)
router.get("/",checkAuth(Role.ADMIN),ParcelController.getAllParcel)
router.get("/me",checkAuth(Role.SENDER),ParcelController.getMyParcelByEmail)
router.patch("/cancel/:id",checkAuth(Role.SENDER,Role.ADMIN),ParcelController.cancelMyParcel)
router.patch("/:id/status",checkAuth(Role.ADMIN),ParcelController.updateParcelStatus)





export const ParcelRoutes = router