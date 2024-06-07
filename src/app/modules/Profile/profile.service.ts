/* eslint-disable @typescript-eslint/no-explicit-any */
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";

const getMyProfile = async (token: any) => {
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.jwt_secret as Secret,
  );

  const userId = verifiedUser.userId;

  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });

  return result;
};

const updateMyProfile = async (token: string, userData: any) => {
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.jwt_secret as Secret,
  );

  const userId = verifiedUser.userId;

  const result = await prisma.userProfile.update({
    where: {
      userId: userId,
    },
    data: userData,
  });

  return result;
};

// update user profile picture
const updateUserProfilePicture = async (data: any) => {
  const result = await prisma.user.update({
    where: {
      id: data.id,
    },
    data: {
      profilePicture: data.profilePicture,
    },
    select: {
      id: true,
      name: true,
      email: true,
      needPasswordChange: true,
      role: true,
      bloodType: true,
      location: true,
      profilePicture: true,
      totalDonations: true,
      availability: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

export const profileService = {
  getMyProfile,
  updateMyProfile,
  updateUserProfilePicture,
};
