import { Router } from 'express';
import { joiValidator } from 'iyasunday';
import validation from './validation';
import * as controllers from './controllers';

const route = new Router();

route.post(
  '/signup',
  joiValidator(validation.signup),
  controllers.addUser
);

route.post(
  '/signin',
  joiValidator(validation.login),
  controllers.login
);

route.get(
  '/verify-email',
  controllers.verifyEmail
);

route.post(
  '/social-login',
  joiValidator(validation.socialLogin),
  controllers.socialLogin
)

route.get(
  '/resend-verify-email-link',
  controllers.resendEmailVerificationLink
);

export default route;
