import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
   {
      path: "/auth",
      route: AuthRoutes,
   },
   // {
   //    path: "/blogs",
   //    route: "",
   // },
   // {
   //    path: "/admin",
   //    route: "",
   // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
