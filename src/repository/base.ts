import mysql from 'mysql';
import { queryDB as queryWrapper } from './../helpers/database';

/**
 * @typedef {object} ResultObject
 */

/**
 * Base Class for Repository
 * It's abstract, DO NOT TRY TO `new` IT
 * 
 * @property {mysql.Connection} connection - Database connection instance
 * @abstract
 */
export abstract class Repository {
  /**
   * Database connection instance
   *
   * @private
   * @type {mysql.Connection}
   * @memberof Repository
   */
  private connection: mysql.Connection;

  /**
   * Creates a new Repository
   * 
   * @param {mysql.Connection} connection Mysql connection object
   * @public
   */
  public constructor(connection: mysql.Connection) {
    this.connection = connection;
  }

  /**
   * Executes a 'find' query with the object's database connection
   * 
   * @param {string} query Query to be executed, MUST be in the prepared form
   * @param {string[]} params Parameters for the `query`
   * @return {Promise<T[]>} Database response, array of `T`
   * @protected
   * @template T
   * @memberof Repository
   */
  protected execFindQuery = <T>(query: string, params: string[]): Promise<T[]> => {
    return queryWrapper(this.connection, query, params);
  }

  /**
   * Executes a non-'find' query with the object's database connection
   *
   * @param {string} query Query to be executed, MUST be on prepared form
   * @param {string[]} params Parameters for the `query`
   * @return {Promise<ResultObject>} Database response object
   * @protected
   * @memberof Repository
   */
  protected execOtherQuery = (query: string, params: string[]): Promise<ResultObject> => {
    return queryWrapper(this.connection, query, params);
  }

  /**
   * Find all entities in the database
   * 
   * @return {Promise<T[]>} Array of `T`
   * @public
   * @abstract
   * @template T 
   */
  public abstract findAll: <T>() => Promise<T[]>

  /**
   * Creates a new entity, then insert it to the database
   * 
   * @param {T} params Parameters for entity creation
   * @return {Promise<ResultObject>} Database response object
   * @public
   * @abstract
   * @template T
   */
  public abstract create: <T>(params: T) => Promise<ResultObject>

  /**
   * Updates an entity in the database
   * 
   * @param {T} params Parameters for entity update
   * @return {Promise<ResultObject>} Database response object
   * @public
   * @abstract
   * @template T
   */
  public abstract update: <T>(params: T) => Promise<ResultObject>

  /**
   * Deletes an entity from the database
   * 
   * @param {T} params Parameters for entity deletion
   * @return {Promise<ResultObject>} Database response object
   * @public
   * @abstract
   * @template T
   */
  public abstract delete: <T>(params: T) => Promise<ResultObject>
}
