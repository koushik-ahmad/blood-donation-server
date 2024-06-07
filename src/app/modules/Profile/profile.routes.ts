import express from "express";
import auth from "../../middlewares/auth";
import { profileController } from "./profile.controller";
import validateRequest from "../../middlewares/validateRequest";
import { profileValidationSchema } from "./profile.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/my-profile",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  profileController.getMyProfile,
);

router.put(
  "/update-my-profile",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(profileValidationSchema.updateProfileSchema),
  profileController.updateMyProfile,
);

router.put(
  "/update-profile-photo",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  profileController.updateUserProfilePicture,
);

export const profileRoutes = router;
