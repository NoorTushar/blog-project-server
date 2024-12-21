import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

import httpStatus from "http-status";
import { TUserRole } from "../modules/user/user.interface";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import config from "../config";

const auth = (...requiredRoles: TUserRole[]) => {
   return catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
         const fullAuthorizationToken = req.headers.authorization;

         // get the token by removing the Bearer word
         const token = fullAuthorizationToken?.split("Bearer ")[1];

         // if token is unavailable
         if (!token) {
            throw new AppError(
               httpStatus.UNAUTHORIZED,
               "You are not authorized"
            );
         }

         // check if the token is valid
         jwt.verify(
            token,
            config.jwt_access_secret as string,
            function (err, decoded) {
               //
               if (err) {
                  throw new AppError(
                     httpStatus.UNAUTHORIZED,
                     "You are not authorized"
                  );
               }

               // get the role found in token
               const role = (decoded as JwtPayload).role;

               // does the token role match with our desired role.
               // ex, token wala is 'student' but our required role is 'admin'
               if (requiredRoles && !requiredRoles.includes(role)) {
                  throw new AppError(
                     httpStatus.UNAUTHORIZED,
                     "You are not authorized"
                  );
               }

               req.user = decoded as JwtPayload;

               next();
            }
         );
      }
   );
};

export default auth;
