"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(5, { message: "User name must be at least of 5 characters" })
            .max(30, { message: "User name must not exceed 30 characters" }),
        password: zod_1.z
            .string()
            .min(5, { message: "Password must be at least of 5 characters" })
            .max(20, { message: "Password must not exceed 20 characters" }),
        email: zod_1.z.string().email({ message: "Invalid email address" }),
    }),
});
exports.UserValidations = {
    createUserValidationSchema,
};
