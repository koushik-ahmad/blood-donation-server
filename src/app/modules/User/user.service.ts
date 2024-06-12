/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/IPaginationOptions";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { Prisma, User, UserStatus } from "@prisma/client";
import { userSearchAbleFields } from "./user.constant";
import httpStatus from "http-status";
import { IUserFilterRequest } from "./user.interface";
import { IGenericResponse } from "../../interfaces/common";
import AppError from "../../errors/ApiError";

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

  // andConditions.push({
  //   status: UserStatus.ACTIVE,
  // });

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

// partial updating the user
const updateUserByAdmin = async (data: any) => {
  const userId = data.id;
  // Find the user
  const findUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
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

//Delete User
const deleteUser = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
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

export const userServices = {
  getAllFromDB,
  getByIdFromDB,
  updateUserByAdmin,
  deleteUser,
};
