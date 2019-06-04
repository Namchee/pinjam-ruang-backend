export default class Acara {
  constructor(id, start_time, end_time, user, room, desc) {
    this.id = id;
    this.start_time = start_time;
    this.end_time = end_time;
    this.user = user;
    this.room = room;
    this.desc = desc;
  }
}