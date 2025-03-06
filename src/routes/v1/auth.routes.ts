import { Router } from "express";

import { authController } from "@/controllers";
import { rateLimiter, validate, authMiddleware } from "@/middlewares";
import { authValidation } from "@/validations";

const router = Router({
  mergeParams: true
});

router.post(
  "/register",
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 10 }),
  validate(authValidation.register),
  authController.registerHandler
);
router.post(
  "/login",
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 3 }),
  validate(authValidation.login),
  authController.loginHandler
);
router.post("/logout", authMiddleware, rateLimiter({}), authController.logoutHandler);
router.get("/status", authMiddleware, rateLimiter({}), authController.statusHandler);

// router.post("/refresh-token", rateLimiter({ max: 20 }), refreshTokenHandler);
// router.post(
//   "/forgot_password",
//   rateLimiter({ max: 20 }),
//   validate(authValidation.forgot_password),
//   forgotPasswordHandler
// );
// router.post(
//   "/reset_password",
//   rateLimiter({ max: 20 }),
//   validate(authValidation.reset_password),
//   resetPasswordHandler
// );

export default router;
