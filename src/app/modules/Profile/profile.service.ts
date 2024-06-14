/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
      profilePicture: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });

  return result;
};

const updateMyProfile = async (user: any, data: any) => {
  const userId = user.userId;

  // console.log(userId);

  // Find the user and include their profile
  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      userProfile: true,
    },
  });

  if (!profile) {
    return {
      success: false,
      statusCode: 404,
      message: "User not found!",
    };
  }

  // Separate the user and userProfile data
  const userData = {
    name: data.name,
    email: data.email,
    password: data.password,
    needPasswordChange: data.needPasswordChange,
    role: data.role,
    bloodType: data.bloodType,
    location: data.location,
    profilePicture: data.profilePicture,
    totalDonations: data.totalDonations,
    availability: data.availability,
    status: data.status,
  };

  const userProfileData = {
    bio: data.bio,
    age: data.age,
    contactNumber: data.contactNumber,
    lastDonationDate: data.lastDonationDate,
  };

  // console.log("user data = ", userData);

  const filteredUserData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined),
  );
  const filteredUserProfileData = Object.fromEntries(
    Object.entries(userProfileData).filter(([_, v]) => v !== undefined),
  );

  // Use a transaction to update both User and UserProfile
  const [updatedUser, updatedUserProfile] = await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: filteredUserData,
    }),
    prisma.userProfile.update({
      where: {
        userId: userId,
      },
      data: filteredUserProfileData,
    }),
  ]);

  return {
    data: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      bloodType: updatedUser.bloodType,
      location: updatedUser.location,
      profilePicture: updatedUser.profilePicture,
      totalDonations: updatedUser.totalDonations,
      availability: updatedUser.availability,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      userProfile: {
        bio: updatedUserProfile.bio,
        age: updatedUserProfile.age,
        contactNumber: updatedUserProfile.contactNumber,
        lastDonationDate: updatedUserProfile.lastDonationDate,
        createdAt: updatedUserProfile.createdAt,
        updatedAt: updatedUserProfile.updatedAt,
      },
    },
  };
};

// update user profile picture
const updateUserProfilePicture = async (data: any) => {
  // const verifiedUser = jwtHelpers.verifyToken(
  //   token,
  //   config.jwt.jwt_secret as Secret,
  // );
  // const userId = verifiedUser.userId;

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
