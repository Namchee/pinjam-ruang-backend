export class Acara {
  constructor(data) {
    this.id = data.id;
    this.startTime = new Date(data.start_time).toISOString();
    this.endTime = new Date(data.end_time).toISOString();
    this.name = data.name;
    this.status = data.status;
    this.desc = data.desc;
    this.userId = data.user_id;
    this.roomId = data.room_id;
    this.userName = data.user_name;
    this.roomName = data.room_name;
  }
}
