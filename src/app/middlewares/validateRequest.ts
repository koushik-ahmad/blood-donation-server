import { AnyZodObject } from "zod";
import catchAsync from "../../shared/catchAsync";

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, _res, next) => {
    await schema.parseAsync(req.body);

    next();
  });
};

export default validateRequest;
