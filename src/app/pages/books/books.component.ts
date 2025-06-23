import { Component, OnInit } from "@angular/core";
import { BasicTableComponent } from "../../components/tables/basic-table/basic-table.component";
import { BookService } from "../../services/book.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-books",
  imports: [BasicTableComponent],
  templateUrl: "./books.component.html",
  styleUrl: "./books.component.scss",
})
export class BooksComponent implements OnInit {
  constructor(private bookService: BookService) {}
  ngOnInit(): void {
    this.getAll();
  }

  columns = ["titulo", "editora", "anoPublicacao", "edicao", "valor", "id"];
  elements: any[] = [
    {
      id: 1,
      titulo: "Dom Casmurro",
      editora: "Editora A",
      edicao: 1,
      anoPublicacao: "1899",
      valor: 39.9,
      autores: [{ id: 1, nome: "Machado de Assis" }],
      assuntos: [
        { id: 1, descricao: "Romance" },
        { id: 2, descricao: "Conto" },
      ],
    },
    {
      id: 2,
      titulo: "O Cortiço",
      editora: "Editora B",
      edicao: 2,
      anoPublicacao: "1890",
      valor: 29.5,
      autores: [{ id: 2, nome: "Aluísio Azevedo" }],
      assuntos: [
        { id: 1, descricao: "Romance" },
        { id: 3, descricao: "Naturalismo" },
      ],
    },
    {
      id: 3,
      titulo: "Memórias Póstumas de Brás Cubas",
      editora: "Editora A",
      edicao: 1,
      anoPublicacao: "1881",
      valor: 35.0,
      autores: [{ id: 1, nome: "Machado de Assis" }],
      assuntos: [
        { id: 1, descricao: "Romance" },
        { id: 4, descricao: "Filosofia" },
      ],
    },
    {
      id: 4,
      titulo: "A Moreninha",
      editora: "Editora C",
      edicao: 3,
      anoPublicacao: "1844",
      valor: 25.0,
      autores: [{ id: 3, nome: "Joaquim Manuel de Macedo" }],
      assuntos: [
        { id: 1, descricao: "Romance" },
        { id: 5, descricao: "Juventude" },
      ],
    },
  ];

  async getAll() {
    // let arr: any[] = [];
    // this.elements.forEach((el) => {
    //   arr.push(new Livro(el));
    // });
    // this.elements = arr;
    this.elements = await firstValueFrom(this.bookService.all());
  }

  async actionEvent(evt: any): Promise<void> {
    console.log("evt", evt);
    if (evt.action === "delete" && evt.item) {
      let res = await firstValueFrom(this.bookService.delete(evt.item.id));

      if (res) {
        this.getAll();
      }
    }
  }
}
