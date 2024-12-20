import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { UserControllers } from "./user.controller";

const router = Router();

router.post(
   "/",
   validateRequest(UserValidations.createUserValidationSchema),
   UserControllers.createUser
);

router.get("/", UserControllers.getAllUsers);

export const UserRoutes = router;
