export class User {
  id!: number;
  nome!: string;
  email!: string;
  password!: string;
  constructor(id?: number, nome?: string, email?: string, password?: string) {
    this.id = id !== undefined ? id : 0;
    this.nome = nome !== undefined ? nome : "";
    this.email = email !== undefined ? email : "";
    this.password = password !== undefined ? password : "";
  }
}
