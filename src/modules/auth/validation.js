import { Joi } from "express-validation";
import { validateEmail } from "../../utils/helpers";

export default {
  signup: {
    body: Joi.object({
      firstName: Joi.string().min(2).required(),
      lastName: Joi.string().min(2).required(),
      email: Joi.string()
        .min(10)
        .required()
        .custom((val, helper) => {
          if (!validateEmail(val)) {
            return helper.message("Please input a valid email");
          }
          return true;
        }),
      password: Joi.string().min(5).required(),
    })
  },
  login: {
    body: Joi.object({
      email: Joi.string().min(10).required()
      .custom((val, helper) => {
        if (!validateEmail(val)) {
          return helper.message("Please input a valid email");
        }
        return true;
      }),
      password: Joi.string().min(5).required(),
    }),
  },
};
