import { z } from "zod";

const updateProfileSchema = z.object({
  bio: z
    .string({
      required_error: "bio field is required.",
    })
    .optional(),
  age: z
    .number({
      required_error: "age field is required.",
    })
    .optional(),
  lastDonationDate: z
    .string({
      required_error: "donation date is required.",
    })
    .optional(),
});

export const profileValidationSchema = {
  updateProfileSchema,
};
