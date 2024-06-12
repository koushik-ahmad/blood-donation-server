import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidationSchema } from "./auth.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidationSchema.registerUser),
  AuthController.registerUser,
);

router.post(
  "/login",
  validateRequest(AuthValidationSchema.loginUser),
  AuthController.loginUser,
);

router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  AuthController.changePassword,
);

router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
