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
  elements: any[] = [];

  async getAll() {
    this.elements = await firstValueFrom(this.bookService.all()).catch(
      () => [],
    );
  }

  async actionEvent(evt: any): Promise<void> {
    console.log("evt", evt);
    if (evt.action === "delete" && evt.item) {
      let res = await firstValueFrom(this.bookService.delete(evt.item.id));

      await this.getAll();
    }
  }
}
