import { Router } from "express";

import authRoutes from "./auth.routes";
import docsRoutes from "./docs.routes";

const router = Router({
  mergeParams: true
});

router.use("/auth", authRoutes);
router.use("/docs", docsRoutes);

export default router;
