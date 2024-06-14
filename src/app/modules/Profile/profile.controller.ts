import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { profileService } from "./profile.service";
import { IAuthUser } from "../../interfaces/common";

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

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const result = await profileService.updateMyProfile(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully!",
      data: result.data,
    });
  },
);

const updateUserProfilePicture = catchAsync(
  async (req: Request, res: Response) => {
    // const authorization: string = req.headers.authorization || "";
    const result = await profileService.updateUserProfilePicture(
      // authorization,
      req.body,
    );

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
