/* eslint-disable camelcase */

/**
 * An interface representing `Acara` in raw form
 *
 * @interface Acara
 */
interface Acara {
  id: number;
  name: string;
  start_time: Date;
  end_time: Date;
  status: number;
  desc: string;
  user_name: string;
  room_name: string;
}

/**
 * An interface representing 'find' parameters
 *
 * @interface FindParameters
 */
interface FindParameters {
  id?: number;
  name?: string;
  status?: number;
}

interface FindConflictsParameters {
  startTime: Date;
  endTime: Date;
  roomId: number;
}

interface ConflictingAcara {
  name: string;
}

interface GetParameters {
  id: number;
}

interface GetResult {
  id: number;
  name: string;
  start_time: Date;
  end_time: Date;
  desc: string;
  user_id: number;
  user_name: string;
  room_id: number;
}

/**
 * An interface representing the required parameters for 'create' and 'update' operation
 *
 * @interface AcaraData
 */
interface AcaraData {
  startTime: Date;
  endTime: Date;
  name: string;
  desc: string;
  status: number;
  userId: number;
  roomId: number;
}
