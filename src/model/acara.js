export default class Acara {
  constructor(data) {
    this.id = data.id;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.status = data.status;
    this.desc = data.desc;
    this.user_id = data.user_id;
    this.room_id = data.room_id;
    this.user_name = data.user_name;
    this.room_name = data.room_name;
  }
}