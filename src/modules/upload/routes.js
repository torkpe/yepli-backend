import { Router } from 'express';
import * as controllers from './controllers';
import { authMiddleware } from '../../routes/customMiddleware';
import { upload } from '../../utils/helpers';

const route = new Router();


route.post(
  '/',
  authMiddleware,
  upload.single('file'),
  controllers.uploadPhoto
);


export default route;
