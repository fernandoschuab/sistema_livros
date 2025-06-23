export class Autor {
  id!: number;
  nome!: string;
  constructor(id?: number, nome?: string) {
    this.id = id !== undefined ? id : 0;
    this.nome = nome !== undefined ? nome : "";
  }
}
