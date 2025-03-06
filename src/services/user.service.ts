import httpStatus from "http-status";

import { userModel, UserDocument } from "@/models";
import { ApiError } from "@/utils";

/**
 * Get user by id
 * @param {string} userId - The user's ID
 * @returns {Promise<UserDocument>} The user document
 * @throws {ApiError} When user is not found (404 Not Found)
 */
const getUserById = async (userId: string): Promise<UserDocument> => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return user;
};

export default { getUserById };
