import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "../user/user.validation";
import { UserControllers } from "../user/user.controller";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post(
   "/register",
   validateRequest(UserValidations.createUserValidationSchema),
   UserControllers.createUser
);

router.post(
   "/login",
   validateRequest(AuthValidations.loginValidationSchema),
   AuthControllers.loginUser
);

export const AuthRoutes = router;
