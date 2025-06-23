import { Livro } from "./livro.model";

export class Assunto {
  id!: number;
  descricao!: string;
  livros!: Livro[];
  constructor(id?: number, descricao?: string) {
    this.id = id !== undefined ? id : 0;
    this.descricao = descricao !== undefined ? descricao : "";
  }
}
