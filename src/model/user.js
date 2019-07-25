export default class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.isAdmin = data.is_admin;
  }
}
