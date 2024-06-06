/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import AppError from "../errors/ApiError";
import handleZodError from "../errors/handleZodError";

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const errorResponse = {
    success: false,
    message: error.message || "Something went wrong",
    errorDetails: error,
  };

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;

  if (error instanceof ZodError) {
    const { message, issues } = handleZodError(error);
    errorResponse.message = message;
    errorResponse.errorDetails = { issues };
    statusCode = httpStatus.BAD_REQUEST;
  } else if (error instanceof AppError) {
    errorResponse.message = error.message;
    statusCode = error.statusCode;
  }

  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
