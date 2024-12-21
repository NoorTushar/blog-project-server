import { Router } from "express";

import { BlogController } from "./blog.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constants";

const router = Router();

router.post("/", BlogController.createBlog);
router.get("/:id", BlogController.getSingleBlog);
router.patch("/:id", BlogController.updateBlog);
router.delete("/:id", auth(USER_ROLE.user), BlogController.deleteBlog);
router.get("/", BlogController.getAllBlogs);

export const BlogRoutes = router;
