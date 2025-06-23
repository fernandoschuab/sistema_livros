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
  elements: any[] = [];

  async getAll() {
    this.elements = await firstValueFrom(this.subjectService.all()).catch(
      () => [],
    );
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
