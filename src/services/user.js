import { Promise } from 'bluebird'; 
import { validateData } from '../helpers/api';
import { authenticationSchema, updateRoleSchema, deleteUserSchema } from './../schemas/user';
import User from './../model/user';
import { OAuth2Client } from 'google-auth-library';
import { config } from './../../config/config';

function toDTO(data) {
  return new User(data);
}

function toDataArray(data) {
  const arr = [];

  for (const user of data) {
    arr.push(toDTO(user));
  }

  return arr;
}

export function checkUserExistence(userRepository) {
  return async function(params) {
    try {
      if (params &&
        Object.keys(params).length === 1 &&
        params.id) {
        const res = await userRepository.exist(params);
        
        return res[0].jml > 0;
      } else {
        const err = new Error('Invalid parameters');
        err.statusCode = 422;

        throw err;
      }
    } catch (err) {
      throw err;
    }
  };
}

export function authenticate(userRepository) {
  const client = new OAuth2Client(config.clientID);

  return async function(params) {
    try {
      await validateData(params, authenticationSchema);

      const verifiedToken = await client.verifyIdToken({
        idToken: params.token,
        audience: process.env.CLIENT_ID,
      });

      const user = verifiedToken.getPayload();

      if (!user['email_verified']) {
        const err = new Error('Email not verified');
        err.statusCode = 401;

        throw err;
      }
      
      let searchDb = await userRepository.findByEmail({ email: user.email });

      if (searchDb.length === 0) {
        await userRepository.create({
          email: user.email,
          name: user.name,
          isAdmin: false,
        });

        searchDb = await userRepository.findByEmail({ email: user.email });
      }

      const tokenPayload = {
        id: searchDb.id,
        isAdmin: searchDb.is_admin,
      };

      return tokenPayload;
    } catch (err) {
      throw err;
    }
  };
}

export function findUser(userRepository) {
  return async function(params) {
    try {
      if (params && Object.keys(params).length !== 0) {
        if (Object.keys(params).length === 1) {
          if (params.id) {
            const user = await userRepository.findById(params);

            return toDTO(user[0]);
          } else if (params.name) {
            const user = await userRepository.findByName(params);

            return toDataArray(user);
          } else {
            const err = new Error('Invalid parameters');
            err.statusCode = 422;
  
            throw err;
          }
        } else {
          const err = new Error('Invalid parameters');
          err.statusCode = 422;
  
          throw err;
        }
      } else {
        const user = await userRepository.findAll();

        return toDataArray(user);
      }
    } catch (err) {
      throw err;
    }
  };
}

export function updateUserRole(userRepository) {
  return async function(params) {
    try {
      await validateData(params, updateRoleSchema);

      return await userRepository.updateRole(params);
    } catch (err) {
      throw err;
    }
  };
}

export function deleteUser(userRepository, acaraRepository) {
  return async function(params) {
    try {
      await validateData(params, deleteUserSchema);

      const acaras = await acaraRepository.findUserAcara(params);
      const arr = [];

      for (const acara of acaras) {
        arr.push(acaraRepository.delete(acara.id));
      }

      await Promise.all(arr);

      return await userRepository.delete(params);
    } catch (err) {
      throw err;
    }
  };
};

export function createUserService(userRepository) {
  return {
    authenticate: authenticate(userRepository),
    findUser: findUser(userRepository),
    deleteUser: deleteUser(userRepository),
    updateUserRole: updateUserRole(userRepository),
  };
}
