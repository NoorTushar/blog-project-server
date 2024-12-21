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

// app.use(globalErrorHandler);

app.use((err: any, req: Request, res: Response, next) => {
   let statusCode = err.statusCode || 400;
   let message = err.message || "something went wrong";
   let error = {
      details: {
         path: "",
         message: err?.message || "Something went wrong",
      },
   };

   const handleZodError = (err: ZodError) => {
      const statusCode = 400;
      const message = "Validation Error";
      const error = {
         details: err.issues.map((issue: ZodIssue) => {
            return {
               path: issue.path[issue.path.length - 1],
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

   if (err instanceof ZodError) {
      const simplifiedError = handleZodError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      error = simplifiedError.error;
   }
   //ultimate return
   return res.status(err?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message,
      statusCode,
      error,
      amarError: err,
      stack: err?.stack || null,
   });
});

//Not Found
app.use(notFound);

export default app;
