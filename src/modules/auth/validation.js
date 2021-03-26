import { Joi } from "express-validation";

export default {
  signup: {
    body: {
      schema: Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().min(10).required().email(),
        password: Joi.string().min(5).required(),
        category: Joi.string().min(5).required(),
        phoneNumber: Joi.string().min(11).required(),
        location: Joi.string().min(2).required(),
      }),
    },
  },
  login: {
    body: {
      schema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
      }),
    },
  },
  socialLogin: {
    body: {
      schema: Joi.object({
        accessToken: Joi.string().required(),
        service: Joi.string()
          .allow("facebook").only().required(),
      }),
    },
  },
};
