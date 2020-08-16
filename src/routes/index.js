require('dotenv').config();
import { Router } from 'express';
import Auth from '../modules/auth/routes';
import { errorHandler } from '../utils/errohandler';

export default app => {
  const apiVersion = process.env.API_PREFIX;
  app.use(`/${apiVersion}/auth`, Auth);

  app.use((err, req, res, next) => {
    if (err) {
      errorHandler(err, res);
    } else {
      res.status(404).json({ message: 'Requested route not found' });
    }
  });
}
