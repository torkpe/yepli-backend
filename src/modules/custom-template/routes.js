import { Router } from 'express';
import * as controllers from './controllers';
import { authMiddleware } from '../../routes/customMiddleware';

const route = new Router();

route.post(
  '/',
  // validate(validation.signup),
  authMiddleware,
  controllers.addTemplate
);

route.patch(
  '/:_id',
  // validate(validation.signup),
  authMiddleware,
  controllers.addTemplate
);

route.get(
  '/',
  authMiddleware,
  controllers.getTemplates
)


export default route;
