export default class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.email = data.email;
    this.isAdmin = data.is_admin;
  }
}
