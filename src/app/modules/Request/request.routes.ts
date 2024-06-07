import express from "express";
import { donationController } from "./request.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { statusValidationSchema } from "./request.validation";

const router = express.Router();

router.get("/api/donor-list", donationController.getAllDonor);

router.post(
  "/api/donation-request",
  auth(),
  validateRequest(statusValidationSchema.createRequest),
  donationController.createDonationRequest,
);

router.get(
  "/api/donation-request",
  auth(),
  donationController.getAllDonationRequest,
);

router.put(
  "/api/donation-request/:requestId",
  auth(),
  validateRequest(statusValidationSchema.updateStatusRequest),
  donationController.updateRequestStatus,
);

export const requestRoutes = router;
