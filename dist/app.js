"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("./app/errors/AppError"));
const app = (0, express_1.default)();
// parsers
app.use(express_1.default.json());
app.use(express_1.default.raw());
app.use(express_1.default.text());
app.use((0, cors_1.default)());
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello From the Blog Site ⚡️⚡️");
});
// Error-handling middleware
app.use((err, req, res, next) => {
    let statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || 400;
    let message = (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong";
    let error = {
        details: [
            {
                path: "",
                message: (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong",
            },
        ],
    };
    const handleZodError = (err) => {
        const statusCode = 400;
        const message = "Validation Error";
        const error = {
            details: err.issues.map((issue) => {
                return {
                    path: issue.path[issue.path.length - 1], // Ensures compatibility with `string | number`
                    message: issue.message,
                };
            }),
        };
        return {
            statusCode,
            message,
            error,
        };
    };
    const handleValidationError = (err) => {
        const statusCode = 400;
        const message = "Validation Error";
        const error = {
            details: Object.values(err.errors).map((value) => {
                return {
                    path: value.path,
                    message: value.message,
                };
            }),
        };
        return {
            statusCode,
            message,
            error,
        };
    };
    const handleCastError = (err) => {
        const statusCode = 400;
        const message = "Invalid Id";
        const error = {
            details: [
                {
                    path: err.path,
                    message: err.message,
                },
            ],
        };
        return {
            statusCode,
            message,
            error,
        };
    };
    const handleDuplicateError = (err) => {
        var _a, _b;
        const statusCode = 400;
        const message = "Duplicate value";
        // Extract value within double quotes using regex
        const match = (_b = (_a = err.errorResponse) === null || _a === void 0 ? void 0 : _a.errmsg) === null || _b === void 0 ? void 0 : _b.match(/"([^"]*)"/);
        // The extracted value will be in the first capturing group
        const extractedMessage = match && match[1];
        const error = {
            details: [
                {
                    path: "",
                    message: `${extractedMessage || "Value"} already exists.`,
                },
            ],
        };
        return {
            statusCode,
            message,
            error,
        };
    };
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error = simplifiedError.error;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error = simplifiedError.error;
    }
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error = simplifiedError.error;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error = simplifiedError.error;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        error = {
            details: [
                {
                    path: "",
                    message: err === null || err === void 0 ? void 0 : err.message,
                },
            ],
        };
    }
    else if (err instanceof Error) {
        message = err.message;
        error = {
            details: [
                {
                    path: "",
                    message: err === null || err === void 0 ? void 0 : err.message,
                },
            ],
        };
    }
    // Ultimate return
    res.status((err === null || err === void 0 ? void 0 : err.statusCode) || statusCode).json({
        success: false,
        message,
        statusCode,
        error,
        stack: (err === null || err === void 0 ? void 0 : err.stack) || null,
    });
});
// Not Found
app.use(notFound_1.default);
exports.default = app;
