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




export const ParcelRoutes = router