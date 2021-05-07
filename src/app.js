require('dotenv').config();
import express from 'express';
import http from 'http';

import { connect } from './utils/db';
import route from './routes';
import middleware from './routes/middleware';
import socketServer from './utils/socket';

const app = express();

connect()
  .then(() => {
    middleware(app);    
    route(app)
    const server = http.createServer(app);
    socketServer(server);
    server.listen(process.env.PORT || 4000, (err) => {
      if (err) {
        console.log(err.toString());
        return;
      }
      console.log('app is now running')
    })    
  }).catch(err => console.log(err.toString()));
