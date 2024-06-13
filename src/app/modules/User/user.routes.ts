import express from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/donor-list", userController.getAllFromDB);

router.get("/donor-list/:id", userController.getByIdFromDB);

// Partially update by admin
router.put(
  "/update-user",
  auth(UserRole.ADMIN),
  validateRequest(userValidation.updateUserByAdmin),
  userController.updateUserByAdmin,
);

//Delete User
router.put(
  "/donor/:id",
  auth(UserRole.ADMIN),
  userController.deleteUserController,
);

export const userRoutes = router;
