import { Router } from 'express';
import {validate} from 'express-validation';
import validation from './validation';
import * as controllers from './controllers';

const route = new Router();

route.post(
  '/signup',
  validate(validation.signup),
  controllers.addUser
);

route.post(
  '/signin',
  validate(validation.login),
  controllers.login
);

route.get(
  '/verify-email',
  controllers.verifyEmail
);

route.get(
  '/resend-verify-email-link',
  controllers.resendEmailVerificationLink
);

export default route;
