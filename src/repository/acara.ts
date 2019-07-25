import { Repository } from './base';
import mysql from 'mysql';

/**
 * Class representing acara repository
 * Basically, it provides an abstraction layer for 'acara'
 * related db access
 * 
 * @extends Repository
 */
export class AcaraRepository extends Repository {

  /**
   * 'Find' query parameters
   *
   * @private
   * @static
   * @type {string[]}
   * @memberof AcaraRepository
   */
  private static readonly findParams: string[] = [
    'id',
    'name',
    'start_time',
    'end_time',
    'status',
    'desc',
    'user_name',
    'room_name',
  ];

  /**
   * Creates new acara repository
   * 
   * @param {mysql.Connection} connection Mysql connection object
   * @public
   */
  public constructor(connection: mysql.Connection) {
    super(connection);
  }

  /**
   * Find all acara
   *
   * @return {Promise<Acara[]>} Array of raw Acara data
   * @public
   * @memberof AcaraRepository
   */
  public findAll = <Acara>(): Promise<Acara[]> => {
    const query: string = `
      SELECT 
        ??, ??, ??, ??, ??, ??, ??, ??
      FROM 
        acara_detail
      ORDER BY
        ??`;

    return this.execFindQuery(query, AcaraRepository.findParams);
  }

  /**
   * Find acara which satisfies the supplied `status` parameter
   * 
   * @param {FindParameters} object FindByStatusParameters
   * @param {number} object.status Status of the acara
   * 0. Pending
   * 1. Accepted
   * 2. Rejected
   * 
   * If status is not a number, it will be ignored
   * @return {Promise<Acara[]>} Array of raw Acara data
   * @public
   * @memberof AcaraRepository
   */
  public findByStatus = <Acara>({ status }: FindParameters): Promise<Acara[]> => {
    const query = `
      SELECT 
        ??, ??, ??, ??, ??, ??, ??, ??
      FROM 
        acara_detail
      WHERE
        ?? = ?
      ORDER BY
        ??`;

    const params = [
      ...AcaraRepository.findParams,
      'status',
      status.toString(),
      'id',
    ];

    return this.execFindQuery(query, params);
  }

  /**
   * Find acara which satisfies the supplied `name`
   *
   * @param {FindParameters} object FindByNameParameters
   * @param {string} object.name Name of acara
   * @param {status=} object.status Status of acara
   * 0. Pending
   * 1. Accepted
   * 2. Rejected
   * 
   * If status is not a number, it will be ignored
   * @return {Promise<Acara[]>} Array of raw Acara data
   * @public
   * @memberof AcaraRepository
   */
  public findByName = <Acara>({ name, status }: FindParameters): Promise<Acara[]> => {
    let query: string = `
      SELECT 
        ??, ??, ??, ??, ??, ??, ??, ??
      FROM 
        acara_detail
      WHERE 
        ?? LIKE ?`;

    const params: string[] = [
      ...AcaraRepository.findParams,
      'name', `%${name}%`,
    ];

    if (status && !isNaN(status)) {
      query += ' AND ?? = ?';
      params.push('status', status.toString());
    }

    query += ' ORDER BY ??';

    params.push('id');

    return this.execFindQuery(query, params);
  }

  /**
   * Find conflicts with the supplied schedule
   * 
   * @param {FindConflictsParameters} object FindConflictsParameters
   * @param {Date} object.startTime Start time of the proposed schedule, MUST be on ISO 8601 format
   * @param {Date} object.endTime End time of the proposed schedule, MUST be on ISO 8601 format
   * @param {number} roomId Room id
   * @public
   * @memberof AcaraRepository
   */
  public findConflicts = ({ startTime, endTime, roomId }: FindConflictsParameters): Promise<ConflictingAcara[]> => {
    const query: string = `
      SELECT
        ??
      FROM 
        acara_detail
      WHERE
        (?? < STR_TO_DATE(?,'%Y-%m-%dT%TZ')
        OR ?? > STR_TO_DATE(?,'%Y-%m-%dT%TZ'))
        AND ?? = ? 
        AND ?? = ?
      GROUP BY 
        ?`;

    const params: string[] = [
      'name',
      'start_time', endTime.toISOString(),
      'end_time', startTime.toISOString(),
      'room_id', roomId.toString(),
      'status', '1',
      'id',
    ];

    return this.execFindQuery(query, params);
  }

  /**
   * Find acaras based on user's id
   *
   * @param {FindUserAcaraParameters} object FindUserAcaraParameters
   * @param {number} object.id User's id
   * @param {number} object.status Status of the Acara
   * 0. Pending
   * 1. Accepted
   * 2. Rejected
   * 
   * If status is not a number, it will be ignored
   * @return {Promise<Acara[]>} Array of raw Acara data
   * @memberof AcaraRepository
   */
  public findUserAcara = ({ id, status }: FindParameters): Promise<Acara[]> => {
    let query: string = `
      SELECT
        ??, ??, ??, ??, ??, ??, ??, ??
      FROM 
        acara_detail
      WHERE 
        ?? = ?`;

    const params: string[] = [
      ...AcaraRepository.findParams,
      'user_id', id.toString(),
    ];

    if (status && !isNaN(status)) {
      query += ' AND ?? =  ?';
      params.push('status', status.toString());
    }

    return this.execFindQuery(query, params);
  }

  /**
   * Get a detailed Acara information, contains id
   * 
   * @param {object} object GetParameters
   * @param {number} object.id Acara's id
   * @return {Promise<GetResult[]>} Array of acara.
   * Although the result is guaranteed to be one, it is still an array
   * So, access the first index (0) to get the desired data
   * @public
   * @memberof AcaraRepository
   */
  public get = ({ id }: GetParameters): Promise<GetResult[]> => {
    const query: string = `
      SELECT
        ??, ??, ??, ??, ??, ??, ??, ??
      FROM 
        acara_detail
      WHERE 
        ?? = ?`;

    const params: string[] = [
      'id',
      'name',
      'start_time',
      'end_time',
      'desc',
      'user_id',
      'user_name',
      'room_id',
      'id', id.toString(),
    ];

    return this.execFindQuery(query, params);
  }

  /**
   * Creates a new Acara
   *
   * @param {AcaraData} acaraInfo Information of acara, refer to `types` for more information
   * @return {Promise<ResultObject>} Database response object
   * @public
   * @memberof AcaraRepository
   */
  public create = <AcaraData>(params: AcaraData): Promise<ResultObject> => {
    const query: string = `
      INSERT INTO 
        acara
        (??, ??, ??, ??, ??, ??, ??)
      VALUES 
        (STR_TO_DATE(?,'%Y-%m-%dT%TZ'),
        STR_TO_DATE(?,'%Y-%m-%dT%TZ'),
        ?, ?, ?, ?, ?)`;

    const parameters: string[] = [
      'start_time',
      'end_time',
      'name',
      'status',
      'desc',
      'user_id',
      'room_id',
      params.startTime.toISOString(),
      params.endTime.toISOString(),
      params.name,
      params.status.toString(),
      params.desc,
      params.userId.toString(),
      params.roomId.toString(),
    ];

    return this.execOtherQuery(query, parameters);
  }
  
  public delete = <GetParameters>({ id }: GetParameters): Promise<ResultObject> => {
    const query: string = `
      DELETE FROM 
        acara
      WHERE 
        ?? = ?`;

    const param: string[] = [
      'id', id.toString(),
    ];

    return this.execOtherQuery(query, param);
  }
}







delete: function({ id }) {
  

update: function(acaraInfo) {
  const query = `
        UPDATE
          acara
        SET
          ?? = ?,
          ?? = ?,
          ?? = ?,
          ?? = ?,
          ?? = ?,
          ?? = ?,
          ?? = ?
        WHERE 
          ?? = ?`;

  const params = [
    'name', acaraInfo.name,
    'start_time', acaraInfo.startTime,
    'end_time', acaraInfo.endTime,
    'status', acaraInfo.status,
    'desc', acaraInfo.desc,
    'user_id', acaraInfo.userId,
    'room_id', acaraInfo.roomId,
    'id', acaraInfo.id,
  ];

  return queryDB(query, params);
},

exist: function({ id }) {
  const query = `
        SELECT
          COUNT(??) as jml
        FROM
          acara
        WHERE
          ?? = ?`;

  const params = ['id', 'id', id,];

  return queryDB(query, params);
},
  };
};
