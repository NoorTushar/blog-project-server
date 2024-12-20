import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "../user/user.validation";
import { UserControllers } from "../user/user.controller";

const router = Router();

router.post(
   "/register",
   validateRequest(UserValidations.createUserValidationSchema),
   UserControllers.createUser
);

export const AuthRoutes = router;
