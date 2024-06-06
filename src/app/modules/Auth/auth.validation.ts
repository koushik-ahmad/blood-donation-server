import { BloodGroup } from "@prisma/client";
import { z } from "zod";

const loginUser = z.object({
  email: z.string({
    required_error: "email field is required",
    invalid_type_error: "email must be string",
  }),
  password: z.string({
    required_error: "password is required",
    invalid_type_error: "password must be string",
  }),
});

const registerUser = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be string",
  }),
  email: z.string({
    required_error: "email field is required.",
    invalid_type_error: "email must be string",
  }),
  password: z.string({
    required_error: "password field is required.",
    invalid_type_error: "password must be string",
  }),
  location: z.string({
    required_error: "location field is required.",
    invalid_type_error: "location must be string",
  }),
  age: z.number({
    required_error: "age field is required.",
    invalid_type_error: "age must be a valid positive number",
  }),
  bio: z.string({
    required_error: "bio field is required.",
    invalid_type_error: "bio must be string",
  }),
  lastDonationDate: z.string({
    required_error: "lastDonationDate field is required.",
    invalid_type_error: "lastDonationDate must be string",
  }),
  bloodType: z.enum([...Object.values(BloodGroup)] as [string, ...string[]], {
    required_error: "bloodType field is required.",
    invalid_type_error: "bloodType must be a valid Blood group type",
  }),
});

export const AuthValidationSchema = {
  loginUser,
  registerUser,
};
