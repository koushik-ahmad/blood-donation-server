/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-self-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { donorSearchAbleFields } from "./request.constants";
import { DonorRequestData, IFilterRequest } from "./request.type";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { IPaginationOptions } from "../../interfaces/IPaginationOptions";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import config from "../../../config";

const getAllDonor = async (
  params: IFilterRequest,
  options: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andConditions.push({
      OR: donorSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
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

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },

    data: result,
  };
};

// donation request
const createDonationRequest = async (token: string, data: DonorRequestData) => {
  try {
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as Secret,
    );

    if (!verifiedUser || verifiedUser.id) {
      throw new Error("Invalid token or user not found");
    }

    // const requesterId = verifiedUser.id;
    const tokenId = verifiedUser.userId;

    const donor = await prisma.user.findUnique({
      where: {
        id: data.donorId,
      },
      include: {
        userProfile: true,
      },
    });

    if (!donor) {
      throw new Error("Donor not found");
    }

    const result = await prisma.request.create({
      data: {
        donorId: data.donorId,
        requesterId: tokenId,
        phoneNumber: data.phoneNumber,
        dateOfDonation: data.dateOfDonation,
        hospitalName: data.hospitalName,
        hospitalAddress: data.hospitalAddress,
        reason: data.reason,
      },
    });

    // Response object
    const responseData = {
      id: result.id,
      donorId: result.donorId,
      requesterId: result.requesterId,
      phoneNumber: result.phoneNumber,
      dateOfDonation: result.dateOfDonation,
      hospitalName: result.hospitalName,
      hospitalAddress: result.hospitalAddress,
      reason: result.reason,
      requestStatus: result.requestStatus,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      donor: {
        id: donor.id,
        name: donor.name,
        email: donor.email,
        bloodType: donor.bloodType,
        location: donor.location,
        availability: donor.availability,
        createdAt: donor.createdAt,
        updatedAt: donor.updatedAt,
        userProfile: donor.userProfile,
      },
    };

    return responseData;
  } catch (error) {
    throw new Error(`error: ${error}`);
  }
};

const getAllDonationRequest = async () => {
  const result = await prisma.request.findMany({
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          location: true,
          bloodType: true,
          availability: true,
        },
      },
    },
  });
  return result;
};

const updateRequestStatus = async (id: string, data: any) => {
  // console.log(data);

  const result = await prisma.request.update({
    where: {
      id,
    },
    data: {
      requestStatus: data,
    },
  });

  return result;
};

export const donationService = {
  getAllDonor,
  createDonationRequest,
  getAllDonationRequest,
  updateRequestStatus,
};
