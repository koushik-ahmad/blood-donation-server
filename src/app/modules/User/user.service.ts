/* eslint-disable @typescript-eslint/no-explicit-any */
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/IPaginationOptions";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { Prisma, User, UserStatus } from "@prisma/client";
import { userSearchAbleFields } from "./user.constant";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IUserFilterRequest } from "./user.interface";
import { IGenericResponse } from "../../interfaces/common";

const getAllFromDB = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<User[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    status: UserStatus.ACTIVE,
  });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { totalDonations: "desc" },
    include: {
      userProfile: {
        select: {
          id: true,
          userId: true,
          bio: true,
          age: true,
          lastDonationDate: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

//get by id
const getByIdFromDB = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
    include: {
      userProfile: {
        select: {
          id: true,
          userId: true,
          bio: true,
          age: true,
          lastDonationDate: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return result;
};

//Create user
const createUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || "USER",
    bloodType: data.bloodType,
    location: data.location,
    city: data.city,
    totalDonations: data.totalDonations,
    availability: data.availability,
    status: data.status,
  };

  const userInfo = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (userInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const result = prisma.$transaction(async (transactionClient) => {
    const createdUser = await transactionClient.user.create({
      data: userData,
    });

    const createdUserProfile = await transactionClient.userProfile.create({
      data: {
        userId: createdUser.id,
        age: data.age,
        bio: data.bio,
        lastDonationDate: data.lastDonationDate,
      },
    });
    // Fetch user details
    const userDetails = await transactionClient.user.findUnique({
      where: {
        id: createdUser.id,
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
      },
    });

    return { ...userDetails, userProfile: createdUserProfile };
  });

  return result;
};

//Delete User
const deleteUser = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not found");
  }

  const deletedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  return deletedUser;
};

// partial updating the user
const updateUserByAdmin = async (data: any) => {
  const userId = data.id;

  // Find the user
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not found");
  }

  const userData = {
    role: data.role,
    status: data.status,
  };

  const updateUserData = await prisma.user.update({
    where: {
      id: userId,
    },
    data: userData,
  });

  return updateUserData;
};

export const userServices = {
  getAllFromDB,
  getByIdFromDB,
  createUser,
  deleteUser,
  updateUserByAdmin,
};
