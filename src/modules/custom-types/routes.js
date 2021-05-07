import { Router } from 'express';
import * as controllers from './controllers';
import { authMiddleware } from '../../routes/customMiddleware';

const route = new Router();

route.post(
  '/',
  // validate(validation.signup),
  authMiddleware,
  controllers.addType
);

route.patch(
  '/:id',
  // validate(validation.signup),
  authMiddleware,
  controllers.editType
);

route.delete(
  '/:id',
  // validate(validation.signup),
  authMiddleware,
  controllers.deleteType
);

route.get(
  '/',
  authMiddleware,
  controllers.getTypes
)


export default route;
