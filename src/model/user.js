export default class User {
  constructor(id, username, name, email, password, isAdmin) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}