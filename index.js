import config from './config/config';
import express from 'express';
import logger from 'morgan';
import apiRoute from './router/api';
import redirect from './router/redirects';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const port = (config && config.PORT) || 8081;

const app = express();

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow CORS during development
if (config && config.DEV_MODE) {
  app.use(cors());
}

// logger
app.use(logger(config && config.DEV_MODE ? 'dev' : 'tiny'));

// routes
app.use('/api', apiRoute);
app.use('*', redirect);

app.listen(port, () => {
  /* eslint-disable-next-line */
  console.log(`Listening on port ${port}`);
});
