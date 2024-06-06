import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { donationRoutes } from "../modules/Donation/donation.routes";
import { profileRoutes } from "../modules/Profile/profile.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: AuthRoutes,
  },
  {
    path: "/",
    route: donationRoutes,
  },
  {
    path: "/",
    route: profileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
