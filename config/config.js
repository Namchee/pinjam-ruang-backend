import dotenv from 'dotenv';

const result = dotenv.config({
  path: String.prototype.concat(__dirname, '\\config.env'),
});

if (result.error) {
  /* eslint-disable-next-line */
  console.log('WARNING: Configuration file cannot be loaded, using default env');
}
