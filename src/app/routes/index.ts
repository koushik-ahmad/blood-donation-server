import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { profileRoutes } from "../modules/Profile/profile.routes";
import { userRoutes } from "../modules/User/user.routes";
import { requestRoutes } from "../modules/Request/request.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/",
    route: AuthRoutes,
  },
  {
    path: "/",
    route: requestRoutes,
  },
  {
    path: "/",
    route: profileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
