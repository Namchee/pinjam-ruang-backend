/* eslint-disable */

import dotenv from 'dotenv';

let config = dotenv.config({ 
  path: String.prototype.concat(__dirname, '\\config.env')
});

let { parsed: settings } = config;

if (config.error) {
  console.log('WARNING: Configuration file cannot be loaded, using default env');
}

export default settings;