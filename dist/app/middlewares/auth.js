"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const config_1 = __importDefault(require("../config"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const fullAuthorizationToken = req.headers.authorization;
        // get the token by removing the Bearer word
        const token = fullAuthorizationToken === null || fullAuthorizationToken === void 0 ? void 0 : fullAuthorizationToken.split("Bearer ")[1];
        // if token is unavailable
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
        }
        // check if the token is valid
        jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret, function (err, decoded) {
            //
            if (err) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
            }
            // get the role found in token
            const role = decoded.role;
            // does the token role match with our desired role.
            // ex, token wala is 'student' but our required role is 'admin'
            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
            }
            req.user = decoded;
            next();
        });
    }));
};
exports.default = auth;
