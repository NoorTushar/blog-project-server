/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Response, Request, Application, NextFunction } from "express";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { ZodError, ZodIssue } from "zod";
import mongoose from "mongoose";

const app: Application = express();

// parsers
app.use(express.json());
app.use(express.raw());
app.use(express.text());
app.use(cors());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
   res.send("Hello From the Blog Site ⚡️⚡️");
});

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
   let statusCode = err.statusCode || 400;
   let message = err.message || "Something went wrong";
   let error: {
      details: { path: string | number; message: string }[]; // Updated to handle an array
   } = {
      details: [
         {
            path: "",
            message: err?.message || "Something went wrong",
         },
      ],
   };

   const handleZodError = (err: ZodError) => {
      const statusCode = 400;
      const message = "Validation Error";
      const error = {
         details: err.issues.map((issue: ZodIssue) => {
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

   const handleValidationError = (err: mongoose.Error.ValidationError) => {
      const statusCode = 400;
      const message = "Validation Error";

      const error = {
         details: Object.values(err.errors).map((value: any) => {
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

   const handleCastError = (err: mongoose.Error.CastError) => {
      const statusCode = 400;
      const message = "Invalid Id";

      const error = {
         details: {
            path: err.path,
            message: err.message,
         },
      };

      return {
         statusCode,
         message,
         error,
      };
   };

   const handleDuplicateError = (err: any) => {
      const statusCode = 400;
      const message = "Duplicate value";
      console.log("duplicate error: ", err.errorResponse.errmsg);

      // Extract value within double quotes using regex
      const match = err.errorResponse.errmsg.match(/"([^"]*)"/);

      // The extracted value will be in the first capturing group
      const extractedMessage = match && match[1];

      const error = {
         details: {
            path: "",
            message: `${extractedMessage} already exists.`,
         },
      };

      return {
         statusCode,
         message,
         error,
      };
   };

   if (err instanceof ZodError) {
      const simplifiedError = handleZodError(err);

      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      error = simplifiedError.error;
   } else if (err?.name === "ValidationError") {
      const simplifiedError = handleValidationError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      error = simplifiedError.error;
   } else if (err.name === "CastError") {
      const simplifiedError = handleCastError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      error = simplifiedError.error;
   } else if (err?.code === 11000) {
      const simplifiedError = handleDuplicateError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      error = simplifiedError.error;
   }

   // Ultimate return
   res.status(err?.statusCode || statusCode).json({
      success: false,
      message,
      statusCode,
      error,
      amarError: err,
      stack: err?.stack || null,
   });
});

// Not Found
app.use(notFound);

export default app;
