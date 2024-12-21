import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constants";

const router = Router();
// block a user
router.patch(
   "/users/:userId/block",
   auth(USER_ROLE.admin),
   AdminControllers.blockUser
);

// delete a blog
router.delete("/blogs/:id", auth(USER_ROLE.admin), AdminControllers.deleteBlog);

export const AdminRoutes = router;
