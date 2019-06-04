import '../config/config';
import express from 'express';
import logger from 'morgan';
import apiRoute from './routes/api';
import redirect from './routes/redirects';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const port = (process.env.PORT) || 8081;

const app = express();

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow CORS during development
if (process.env.DEV_MODE) {
  app.use(cors());
}

// logger
app.use(logger(process.env.DEV_MODE ? 'dev' : 'tiny'));

// routes
app.use('/api', apiRoute);
app.use('*', redirect);

app.listen(port, () => {
  /* eslint-disable-next-line */
  console.log(`Server runnin' at port ${port}`);
});