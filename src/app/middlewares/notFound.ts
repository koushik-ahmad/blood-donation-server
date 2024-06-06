/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import httpStatus from "http-status";

const notFound: RequestHandler = (req, res, _next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found!",
    error: {
      path: req.originalUrl,
      message: `API endpoint ${req.originalUrl} is not valid!`,
    },
  });
};

export default notFound;
