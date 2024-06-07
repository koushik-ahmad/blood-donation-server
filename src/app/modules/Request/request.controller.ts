import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { donationService } from "./request.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { donorFilterableFields } from "./request.constants";

const getAllDonor = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query)
  const filters = pick(req.query, donorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await donationService.getAllDonor(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donors successfully found",
    meta: result.meta,
    data: result.data,
  });
});

const createDonationRequest = catchAsync(
  async (req: Request, res: Response) => {
    const authorization: string = req.headers.authorization || "";
    // console.log("token",  {authorization} );

    const result = await donationService.createDonationRequest(
      authorization,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Request successfully made",
      data: result,
    });
  },
);

const getAllDonationRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await donationService.getAllDonationRequest();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Donation requests retrieved successfully",
      data: result,
    });
  },
);

const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const status = req.body.status;
  const params = req.params.requestId;
  // console.log("params",params);

  const result = await donationService.updateRequestStatus(params, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation request status successfully updated",
    data: result,
  });
});

export const donationController = {
  getAllDonor,
  createDonationRequest,
  getAllDonationRequest,
  updateRequestStatus,
};
