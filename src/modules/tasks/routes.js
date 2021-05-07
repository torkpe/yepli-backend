import { Router } from 'express';
import * as controllers from './controllers';
import { authMiddleware } from '../../routes/customMiddleware';

const route = new Router();

route.post(
  '/',
  // validate(validation.signup),
  authMiddleware,
  controllers.addTask
);

route.get(
  '/',
  authMiddleware,
  controllers.getTasks
);

route.patch(
  '/:taskId',
  authMiddleware,
  controllers.updateTask
);


export default route;
