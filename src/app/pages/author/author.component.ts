import { CommonModule, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

import { firstValueFrom } from "rxjs";

import { Autor } from "../../models/autor.model";
import { AuthorService } from "../../services/author.service";

@Component({
  selector: "app-author",
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
  templateUrl: "./author.component.html",
  styleUrl: "./author.component.scss",
})
export class AuthorComponent implements OnInit {
  public element: Autor | any;
  public form = new FormGroup({
    nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
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
    private authorService: AuthorService,
  ) {
    this.element = new Autor();
  }

  public async getId(uid: string): Promise<void> {
    if (uid === "new") {
      this.initForm();
      return;
    }
    try {
      const result = await firstValueFrom(this.authorService.id(uid));
      this.element = new Autor(result);
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
      nome: this.element.nome,
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

        let result: Autor;
        result = await firstValueFrom(this.authorService.save(this.element));

        if (result) {
          this.matSnack.open("Autor salvo com sucesso!", undefined, {
            duration: 3000,
          });

          if (!this.element.id) {
            this.element.id = result.id;
            this.router.navigateByUrl(`/autor/${this.element.id}`);
          } else {
            this.router.navigateByUrl("/autores");
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
