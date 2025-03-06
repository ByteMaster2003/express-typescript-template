import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import httpStatus from "http-status";

import { AppConfig } from "@/config";
import { userModel } from "@/models";
import { cacheService } from "@/services";
import { ApiError, catchAsync, tokenUtil, generateMD5Hash } from "@/utils";

export const registerHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { fullname, email, mobileNumber, password } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists, please login!");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await userModel.create({
    email,
    fullname,
    mobileNumber,
    password: hashedPassword
  });

  const payload = {
    id: user.id,
    role: user.role,
    name: user.fullname,
    email: user.email
  };
  // Sign a token
  const accessToken = tokenUtil.signAccessToken(user.id.toString(), payload);
  const refreshToken = tokenUtil.signRefreshToken(user.id.toString(), { id: user.id });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
    maxAge: AppConfig.AUTH.MAX_AGE.ACCESS_TOKEN
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
    maxAge: AppConfig.AUTH.MAX_AGE.REFRESH_TOKEN
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User created successfully",
    accessToken,
    refreshToken
  });
});

export const loginHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const existingUser = await userModel.findOne({ email: email });
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong credentials!");
  }

  const payload = {
    id: existingUser.id,
    role: existingUser.role,
    name: existingUser.fullname,
    email: existingUser.email
  };

  // Sign a token
  const accessToken = tokenUtil.signAccessToken(existingUser.id.toString(), payload);
  const refreshToken = tokenUtil.signRefreshToken(existingUser.id.toString(), {
    id: existingUser.id
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
    maxAge: AppConfig.AUTH.MAX_AGE.ACCESS_TOKEN
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
    maxAge: AppConfig.AUTH.MAX_AGE.REFRESH_TOKEN
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken
  });
});

export const logoutHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.auth;

  // Remove Cookie Tokens
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  // Remove Caches Tokens
  const accessTokenKey = generateMD5Hash(`${id}_access_token`);
  const refreshTokenKey = generateMD5Hash(`${id}_refresh_token`);
  cacheService.auth.deleteSync(accessTokenKey);
  cacheService.auth.deleteSync(refreshTokenKey);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Logged Out Successfully"
  });
});

export const statusHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const auth = req.auth;
  if (!auth) {
    throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]);
  }

  res.status(httpStatus.OK).send({
    success: true,
    message: "Auth Is Valid.",
    user: {
      id: auth.id,
      role: auth.role,
      email: auth.email,
      name: auth.fullname
    }
  });
});

export default { registerHandler, loginHandler, logoutHandler, statusHandler };
