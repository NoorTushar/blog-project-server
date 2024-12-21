"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidations = void 0;
const zod_1 = require("zod");
const createBlogValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            invalid_type_error: "Blog title must be string",
            required_error: "Blog title is required",
        }),
        content: zod_1.z.string({
            invalid_type_error: "Blog content must be string",
            required_error: "Blog content is required",
        }),
    }),
});
const updateBlogValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            invalid_type_error: "Blog title must be string",
        })
            .optional(),
        content: zod_1.z
            .string({
            invalid_type_error: "Blog content must be string",
        })
            .optional(),
        author: zod_1.z
            .string({
            invalid_type_error: "Blog author must be string",
        })
            .optional(),
    }),
});
exports.BlogValidations = {
    createBlogValidationSchema,
    updateBlogValidationSchema,
};
