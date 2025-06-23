import { Component, OnInit } from "@angular/core";
import { BasicTableComponent } from "../../components/tables/basic-table/basic-table.component";
import { firstValueFrom } from "rxjs";
import { SubjectService } from "../../services/sibject.service";

@Component({
  selector: "app-subjects",
  imports: [BasicTableComponent],
  templateUrl: "./subjects.component.html",
  styleUrl: "./subjects.component.scss",
})
export class SubjectsComponent implements OnInit {
  constructor(private subjectService: SubjectService) {}
  ngOnInit(): void {
    this.getAll();
  }

  columns = ["descricao", "id"];
  elements: any[] = [
    {
      id: 1,
      descricao: "Romance",
      livros: [
        "Dom Casmurro",
        "O Cortiço",
        "Memórias Póstumas de Brás Cubas",
        "A Moreninha",
      ],
    },
    {
      id: 2,
      descricao: "Conto",
      livros: ["Dom Casmurro"],
    },
    {
      id: 3,
      descricao: "Naturalismo",
      livros: ["O Cortiço"],
    },
    {
      id: 4,
      descricao: "Filosofia",
      livros: ["Memórias Póstumas de Brás Cubas"],
    },
    {
      id: 5,
      descricao: "Juventude",
      livros: ["A Moreninha"],
    },
  ];

  async getAll() {
    this.elements = await firstValueFrom(this.subjectService.all());
  }

  async actionEvent(evt: any): Promise<void> {
    console.log("evt", evt);
    if (evt.action === "delete" && evt.item) {
      let res = await firstValueFrom(this.subjectService.delete(evt.item.id));

      if (res) {
        this.getAll();
      }
    }
  }
}
