import httpStatus from "http-status";

import { userService } from "@/services";
import { catchAsync, ApiError, tokenUtil } from "@/utils";

// Auth Middeleware with token from Cookies
const authMiddleware = catchAsync(async (req, res, next) => {
  // Get Access Token
  const accessToken: string | null | undefined = req.headers.authorization
    ? req.headers.authorization
    : req.cookies.accessToken;

  // Get Refresh Token
  const refreshToken: string | null | undefined = req.headers["X-Refresh-Token"]
    ? req.headers["X-Refresh-Token"]
    : req.cookies.refreshToken;

  // If no token then throw error
  if (!accessToken && !refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]);
  } else if (!accessToken && refreshToken) {
    const payload = tokenUtil.verifyRefreshToken(refreshToken);
    const userId = payload.id;

    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]);
    }
    const user = await userService.getUserById(userId);
    const authPayload = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.fullname
    };

    // Sign new pair of tokens
    const newAccessToken = tokenUtil.signAccessToken(user.id, authPayload);
    const newRefreshToken = tokenUtil.signRefreshToken(user.id, {
      id: user.id,
      role: user.role
    });

    // Store tokens in cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    req.auth = authPayload;
    return next();
  } else if (accessToken) {
    // Verify accessToken and proceed
    const payload = tokenUtil.verifyAccessToken(accessToken);
    req.auth = payload;
    return next();
  }

  throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication Required!");
});

export { authMiddleware };
