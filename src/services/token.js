/**
 * token.js
 * This file contains all functions which are related to jwt-token processing
 * Author: Namchee
 */

import { asyncWrapper } from './misc';
import jwt from 'jsonwebtoken';
import util from 'util';

const options = {
  issuer: process.env.ISSUER || '',
  expiresIn: '5m',
};

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);
const primary_secret = process.env.MAIN_SECRET || 'SECRET';
const sync_secret = process.env.SYNC_SECRET || 'SECRET';

export async function verify_token(token, sync) {
  const { err: primary_err, res: primary_res } = await asyncWrapper(verify_primary_token(token));
  if (primary_err) {
    if (primary_err.name !== 'TokenExpiredError') {
      throw primary_err;
    }
    
    const { err: sync_err, res: sync_res } = await asyncWrapper(verify_sync_token(sync, token));
    if (sync_err) {
      throw sync_err;
    }

    return {
      status: 2,
      data: null,
    };
  }

  return {
    status: 1,
    data: primary_res,
  };
}

export async function refresh_token(token) {
  const user = jwt.decode(token);
  const { err, res } = await asyncWrapper(generate_token(user));
  if (err) {
    throw err;
  }

  return res;
}

async function sign_token(payload, secret, options = null) {
  const { err, res } = await asyncWrapper(sign(payload, secret, options));
  if (err) {
    throw err;
  }

  return res;
}

async function verify_primary_token(token) {
  const { err, res } = await asyncWrapper(verify(token, primary_secret, options));
  if (err) {
    throw err;
  }

  return res;
}

async function verify_sync_token(sync, primary) {
  const { err, res } = await asyncWrapper(verify(sync, sync_secret));
  if (err || res !== primary) {
    throw err;
  } 

  return res;
}

async function generate_token(user) {
  const { err: primary_err, res: primary_res }= await asyncWrapper(sign_token(user, primary_secret, options));
  const { err: sync_err, res: sync_res } = await asyncWrapper(sign_token(primary_res, sync_secret));
  if (primary_err || sync_err) {
    throw {
      primary: primary_err,
      sync: sync_err,
    };
  }

  return {
    primary: primary_res,
    sync: sync_res,
  };
}

export default {
  verifyToken: verify_token,
  refreshToken: refresh_token,
};
