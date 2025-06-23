import { CommonModule, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { firstValueFrom, Subject } from "rxjs";
import { SubjectService } from "../../services/sibject.service";
import { Assunto } from "../../models/assunto.model";
@Component({
  selector: "app-subject",
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
  ],
  templateUrl: "./subject.component.html",
  styleUrl: "./subject.component.scss",
})
export class SubjectComponent implements OnInit {
  public element: Assunto | any;
  public form = new FormGroup({
    descricao: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
  });
  public notes: any[] = [
    {
      name: "Vacation Itinerary",
      updated: new Date("2/20/16"),
    },
    {
      name: "Kitchen Remodel",
      updated: new Date("1/18/16"),
    },
  ];

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private location: Location,
    private matSnack: MatSnackBar,
    private subjectService: SubjectService,
  ) {
    this.element = new Assunto();
  }

  public async getId(uid: string): Promise<void> {
    if (uid === "new") {
      this.initForm();
      return;
    }
    try {
      const result = await firstValueFrom(this.subjectService.id(uid));
      this.element = new Assunto(result);
      this.initForm();
    } catch (error) {
      console.error("Erro ao carregar livro:", error);
      this.matSnack.open("Erro ao carregar livro.", "Fechar", {
        duration: 3000,
      });
      this.router.navigateByUrl("/books");
    }
  }

  public initForm(): void {
    this.form.reset();
    this.form.patchValue({
      descricao: this.element.descricao,
    });
  }

  public async ngOnInit(): Promise<void> {
    this.active.params.subscribe((p) => this.getId(p["id"]));
  }

  public async save(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        this.element = { ...this.element, ...this.form.value };

        let result: Assunto;
        result = await firstValueFrom(this.subjectService.save(this.element));

        if (result) {
          this.matSnack.open("Assunto salvo com sucesso!", undefined, {
            duration: 3000,
          });

          if (!this.element.id) {
            this.element.id = result.id;
            this.router.navigateByUrl(`/assunto/${this.element.id}`);
          } else {
            this.router.navigateByUrl("/assuntos");
          }
        }
      } catch (error) {
        console.error("Erro ao salvar livro:", error);
        this.matSnack.open(
          "Erro ao salvar livro. Verifique os dados.",
          "Fechar",
          {
            duration: 3000,
          },
        );
      }
    } else {
      this.matSnack.open(
        "Por favor, preencha todos os campos obrigatórios corretamente.",
        "Fechar",
        { duration: 3000 },
      );
    }
  }

  public voltar(): void {
    this.form.reset();
    this.location.back();
  }
}
