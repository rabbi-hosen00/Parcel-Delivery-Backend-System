import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { validateRequest } from '../../middlewares/validateRequest';
import { createParcelZodSchema } from './percel.validation';
import { ParcelController } from './percel.controller';




const router = Router();

router.post(
    "/",
    checkAuth(Role.SENDER),
    validateRequest(createParcelZodSchema),
    ParcelController.createPercel
)

router.get(
    "/",
    checkAuth(Role.ADMIN),
    ParcelController.getAllParcel
)


router.get(
    "/me",
    checkAuth(Role.SENDER),
    ParcelController.getMyParcelByEmail
)



router.patch(
    "/:id",
    checkAuth(Role.SENDER),
    ParcelController.cancelMyParcel
)


router.get(
    "/incoming",
    checkAuth(Role.RECEIVER)
)



export const ParcelRoutes = router