import { Router } from 'express';
import * as controllers from './controllers';
import { authMiddleware } from '../../routes/customMiddleware';

const route = new Router();

route.post(
  '/',
  // validate(validation.signup),
  authMiddleware,
  controllers.addChecklist
);

route.get(
  '/',
  authMiddleware,
  controllers.getChecklists
)


export default route;
