import { Component, OnInit } from "@angular/core";
import { BasicTableComponent } from "../../components/tables/basic-table/basic-table.component";
import { firstValueFrom } from "rxjs";
import { AuthorService } from "../../services/author.service";
@Component({
  selector: "app-authors",
  imports: [BasicTableComponent],
  templateUrl: "./authors.component.html",
  styleUrl: "./authors.component.scss",
})
export class AuthorsComponent implements OnInit {
  constructor(private authorService: AuthorService) {}
  ngOnInit(): void {
    this.getAll();
  }
  columns = ["nome", "id"];
  // columns = ["id", "titulo", "editora", "edicao", "anoPublicacao", "valor", "autores", "assuntos"];
  elements: any[] = [];

  async getAll() {
    this.elements = await firstValueFrom(this.authorService.all()).catch(
      () => [],
    );
  }

  async actionEvent(evt: any): Promise<void> {
    console.log("evt", evt);
    if (evt.action === "delete" && evt.item) {
      let res = await firstValueFrom(this.authorService.delete(evt.item.id));

      if (res) {
        this.getAll();
      }
    }
  }
}
