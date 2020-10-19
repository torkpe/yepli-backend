import { Router } from 'express';
import {validate} from 'express-validation';
import validation from './validation';
import * as controllers from './controllers';
import { authMiddleware } from '../../routes/customMiddleware';
import { upload } from '../../utils/helpers';

const route = new Router();

route.get(
  '/',
  authMiddleware,
  controllers.getUserDetails
);

route.patch(
  '/',
  validate(validation.updateUserDetails),
  authMiddleware,
  controllers.updateUserDetails
);

route.patch(
  '/update-password',
  validate(validation.updatePassword),
  authMiddleware,
  controllers.updatePassword
);

route.patch(
  '/update-image',
  // validate(validation.upd),
  authMiddleware,
  upload.single('file'),
  controllers.updateUserPhoto
);


export default route;
