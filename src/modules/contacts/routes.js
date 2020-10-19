import { Router } from 'express';
import {validate} from 'express-validation';
// import validation from './validation';
import * as controllers from './controllers';
import { authMiddleware } from '../../routes/customMiddleware';

const route = new Router();

route.post(
  '/',
  authMiddleware,
  controllers.addContact
);

route.get(
  '/',
  authMiddleware,
  controllers.getContacts
);

export default route;
