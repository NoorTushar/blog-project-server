"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(user_constants_1.USER_ROLE.user), blog_controller_1.BlogController.createBlog);
router.get("/:id", blog_controller_1.BlogController.getSingleBlog);
router.patch("/:id", (0, auth_1.default)(user_constants_1.USER_ROLE.user), blog_controller_1.BlogController.updateBlog);
router.delete("/:id", (0, auth_1.default)(user_constants_1.USER_ROLE.user), blog_controller_1.BlogController.deleteBlog);
router.get("/", blog_controller_1.BlogController.getAllBlogs);
exports.BlogRoutes = router;
