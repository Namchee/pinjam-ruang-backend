import dotenv from 'dotenv';

const result = dotenv.config({
  path: String.prototype.concat(__dirname, '\\config.env'),
});

if (result.error) {
  /* eslint-disable-next-line */
  console.log('WARNING: Configuration file cannot be loaded, using default env');
}

export const config = {
  db: process.env.DB || 'dev',
  tokenIssuer: process.env.ISSUER || 'ftis@admin',
  primarySecret: process.env.PRIMARY_SECRET || 'PRIMARY_SECRET',
  syncSecret: process.env.SYNC_SECRET || 'SYNC_SECRET',
};
