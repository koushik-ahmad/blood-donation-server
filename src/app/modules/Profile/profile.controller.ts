import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { profileService } from "./profile.service";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const authorization: string = req.headers.authorization || "";

  const result = await profileService.getMyProfile(authorization);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const authorization: string = req.headers.authorization || "";
  const result = await profileService.updateMyProfile(authorization, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully!",
    data: result,
  });
});

const updateUserProfilePicture = catchAsync(
  async (req: Request, res: Response) => {
    const result = await profileService.updateUserProfilePicture(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Profile picture successfully updated!",
      data: result,
    });
  },
);

export const profileController = {
  getMyProfile,
  updateMyProfile,
  updateUserProfilePicture,
};
