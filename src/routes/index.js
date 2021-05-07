require('dotenv').config();
import { Router } from 'express';
import Auth from '../modules/auth/routes';
import Deals from '../modules/deals/routes';
import Users from '../modules/users/routes';
import Contacts from '../modules/contacts/routes';
import Section from '../modules/section/routes';
import Checklist from '../modules/checklist/routes';
import Tasks from '../modules/tasks/routes';
import Types from '../modules/custom-types/routes';
import Template from '../modules/custom-template/routes';
import Upload from '../modules/upload/routes';
import { errorHandler } from '../utils/errohandler';

export default app => {
  const apiVersion = process.env.API_PREFIX;
  app.use(`/${apiVersion}/auth`, Auth);
  app.use(`/${apiVersion}/deals`, Deals);
  app.use(`/${apiVersion}/users`, Users);
  app.use(`/${apiVersion}/tasks`, Tasks);
  app.use(`/${apiVersion}/types`, Types);
  app.use(`/${apiVersion}/templates`, Template);
  app.use(`/${apiVersion}/contacts`, Contacts);
  app.use(`/${apiVersion}/sections`, Section);
  app.use(`/${apiVersion}/upload`, Upload);
  app.use(`/${apiVersion}/checklists`, Checklist);

  app.use((err, req, res, next) => {
    if (err) {
      errorHandler(err, res);
    } else {
      res.status(404).json({ message: 'Requested route not found' });
    }
  });
}
