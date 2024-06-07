import { BloodGroup, UserRole } from "@prisma/client";
import { z } from "zod";

const loginUser = z.object({
  email: z.string({
    required_error: "email field is required",
  }),
  password: z.string({
    required_error: "password is required",
  }),
});

const registerUser = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z.string({
    required_error: "email field is required.",
  }),
  password: z.string({
    required_error: "password field is required.",
  }),
  location: z.string({
    required_error: "location field is required.",
  }),
  age: z.number({
    required_error: "age field is required.",
  }),
  bio: z.string({
    required_error: "bio field is required.",
  }),
  lastDonationDate: z.string({
    required_error: "lastDonationDate field is required.",
  }),
  availability: z.boolean().default(true),
  role: z
    .enum([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER])
    .default(UserRole.USER),
  bloodType: z.enum([...Object.values(BloodGroup)] as [string, ...string[]], {
    required_error: "bloodType field is required.",
  }),
});

export const AuthValidationSchema = {
  loginUser,
  registerUser,
};
