import express from "express";
import auth from "../../middlewares/auth";
import { profileController } from "./profile.controller";
import validateRequest from "../../middlewares/validateRequest";
import { profileValidationSchema } from "./profile.validation";

const router = express.Router();

router.get("/api/my-profile", auth(), profileController.getMyProfile);

router.put(
  "/api/my-profile",
  auth(),
  validateRequest(profileValidationSchema.updateProfileSchema),
  profileController.updateMyProfile,
);

export const profileRoutes = router;
