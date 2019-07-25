/**
 * Result object for non-SELECT operation
 * 
 * @typedef {object} ResultObject
 * @property {number} fieldCount
 * @property {number} affectedRows
 * @property {number} insertId
 * @property {number} serverStatus
 * @property {number} warningCount
 * @property {string} message
 * @property {boolean} protocol41
 * @property {number} changedRows
 * @interface
 */
interface ResultObject {
  fieldCount?: number;
  affectedRows?: number;
  insertId?: number;
  serverStatus?: number;
  warningCount?: number;
  message?: string;
  protocol41?: boolean;
  changedRows?: number;
}