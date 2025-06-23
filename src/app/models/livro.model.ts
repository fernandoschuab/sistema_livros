import { Autor } from "./autor.model";
import { Assunto } from "./assunto.model";

export class Livro {
  id!: number;
  titulo!: string;
  editora!: string;
  edicao!: number;
  anoPublicacao!: string;
  valor!: number;
  autores!: Autor[];
  assuntos!: Assunto[];

  constructor(data?: Partial<Livro>) {
    this.id = data?.id !== undefined ? data.id : 0;
    this.titulo = data?.titulo !== undefined ? data.titulo : "";
    this.editora = data?.editora !== undefined ? data.editora : "";
    this.edicao = data?.edicao !== undefined ? data.edicao : 0;
    this.anoPublicacao =
      data?.anoPublicacao !== undefined ? data.anoPublicacao : "";
    this.valor = data?.valor !== undefined ? data.valor : 0.0;

    this.autores = data?.autores
      ? data.autores.map((autorData) => new Autor(autorData.id, autorData.nome))
      : [];
    this.assuntos = data?.assuntos
      ? data.assuntos.map(
          (assuntoData) => new Assunto(assuntoData.id, assuntoData.descricao),
        )
      : [];
  }

  getDescricaoCompleta(): string {
    const autoresNomes = this.autores.map((a) => a.nome).join(", ");
    const assuntosDescricoes = this.assuntos.map((s) => s.descricao).join(", ");
    return `${this.titulo} (Editora: ${this.editora}, Ano: ${this.anoPublicacao}) - Autores: [${autoresNomes}] - Assuntos: [${assuntosDescricoes}]`;
  }
}
