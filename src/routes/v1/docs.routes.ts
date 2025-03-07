import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerSpecs } from "@/config";

const router = Router({
  mergeParams: true
});

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(swaggerSpecs, {
    explorer: true
  })
);

export default router;
