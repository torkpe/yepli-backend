import { Joi } from "express-validation";

export default {
  updateUserDetails: {
    body: Joi.object({
      firstName: Joi.string().min(2).required(),
      lastName: Joi.string().min(2).required(),
      bio: Joi.string(),
      phoneNumber: Joi.string(),
      company: Joi.string(),
    })
  },
  updatePassword: {
    body: Joi.object({
      newPassword: Joi.string().min(5).required(),
      oldPassword: Joi.string().min(5).required(),
    }),
  },
  // updatePhoto: {
  //   fil
  // }
};
