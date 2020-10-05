import { Router } from 'express';
import {validate} from 'express-validation';
import validation from './validation';
import * as controllers from './controllers';
import { authMiddleware } from '../../routes/customMiddleware';

const route = new Router();

route.post(
  '/',
  // validate(validation.signup),
  authMiddleware,
  controllers.addDeal
);

route.get(
  '/',
  authMiddleware,
  controllers.getDeals
)

route.get(
  '/:dealId',
  authMiddleware,
  controllers.getDeal
)

route.patch(
  '/:dealId',
  authMiddleware,
  controllers.updateDeal
)

route.delete(
  '/:dealId',
  authMiddleware,
  controllers.deleteDeal
)

export default route;
