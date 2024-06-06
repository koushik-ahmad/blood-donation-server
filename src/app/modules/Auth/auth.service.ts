/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { User, UserProfile } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const registerUser = async (userData: any) => {
  let createdUser: User | null = null;
  let createdProfile: UserProfile | null = null;

  const hashedPassword: string = await bcrypt.hash(userData.password, 12);

  const result = await prisma.$transaction(async (tx) => {
    createdUser = await tx.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        bloodType: userData.bloodType,
        location: userData.location,
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
    token: accessToken,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};
