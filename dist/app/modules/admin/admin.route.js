"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
// block a user
router.patch("/users/:userId/block", (0, auth_1.default)(user_constants_1.USER_ROLE.admin), admin_controller_1.AdminControllers.blockUser);
// delete a blog
router.delete("/blogs/:id", (0, auth_1.default)(user_constants_1.USER_ROLE.admin), admin_controller_1.AdminControllers.deleteBlog);
exports.AdminRoutes = router;
