import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidationSchema } from "./auth.validation";

const router = express.Router();

router.post(
  "/api/register",
  validateRequest(AuthValidationSchema.registerUser),
  AuthController.registerUser,
);

router.post(
  "/api/login",
  validateRequest(AuthValidationSchema.loginUser),
  AuthController.loginUser,
);

export const AuthRoutes = router;
