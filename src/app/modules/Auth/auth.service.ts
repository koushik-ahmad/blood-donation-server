/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { User, UserProfile, UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../../errors/ApiError";
import { AuthUtils } from "./auth.utils";
import { IChangePassword } from "./auth.interface";
import { hashedPassword } from "../../../helpers/hashedPassword";

const registerUser = async (userData: any) => {
  let createdUser: User | null = null;
  let createdProfile: UserProfile | null = null;

  const hashedPassword: string = await bcrypt.hash(userData.password, 12);

  const userInfo = await prisma.user.findFirst({
    where: {
      email: userData.email,
    },
  });

  if (userInfo) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const result = await prisma.$transaction(async (tx) => {
    createdUser = await tx.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "USER",
        bloodType: userData.bloodType,
        location: userData.location,
        totalDonations: userData.totalDonations,
        availability: userData.availability,
        status: userData.status,
      },
    });

    createdProfile = await tx.userProfile.create({
      data: {
        userId: createdUser.id,
        bio: userData.bio,
        age: userData.age,
        lastDonationDate: userData.lastDonationDate,
      },
    });

    const { password, ...restData } = createdUser;

    return {
      ...restData,
      userProfile: createdProfile,
    };
  });

  return result;
};

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      userId: userData.id,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    token: accessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user?.userId,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // checking password
  if (
    isUserExist.password &&
    !(await AuthUtils.comparePasswords(oldPassword, isUserExist.password))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  const hashPassword = await hashedPassword(newPassword);

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
};

export const AuthService = {
  registerUser,
  loginUser,
  changePassword,
};
