import { Router } from "express";

import authRoutes from "./auth.routes";

const router = Router({
  mergeParams: true
});

router.use("/auth", authRoutes);

export default router;
