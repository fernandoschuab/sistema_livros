import { Livro } from "./livro.model";

export class Autor {
  id!: number;
  nome!: string;
  livros!: Livro[];
  constructor(id?: number, nome?: string) {
    this.id = id !== undefined ? id : 0;
    this.nome = nome !== undefined ? nome : "";
    // this.livros = [];
  }
}
