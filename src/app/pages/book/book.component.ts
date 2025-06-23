import { AsyncPipe, CommonModule, Location } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { firstValueFrom, map, Observable, startWith } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatSelectModule } from "@angular/material/select";

import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { Livro } from "../../models/livro.model";
import { BookService } from "../../services/book.service";
import { AuthorService } from "../../services/author.service";
import { SubjectService } from "../../services/sibject.service";
import { Autor } from "../../models/autor.model";
import { Assunto } from "../../models/assunto.model";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  model,
  signal,
  inject,
} from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { LiveAnnouncer } from "@angular/cdk/a11y";

@Component({
  selector: "app-book",
  standalone: true,
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
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatListModule,
    MatCheckboxModule,
    MatTableModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./book.component.html",
  styleUrl: "./book.component.scss",
})
export class BookComponent implements OnInit {
  authorCtrl = new FormControl("");
  subjectCtrl = new FormControl("");
  filteredAuthors: Observable<any[]>;
  filteredSubjects: Observable<any[]>;
  @ViewChild("authorInput") authorInput!: ElementRef<HTMLInputElement>;
  @ViewChild("subjectInput") subjectInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private location: Location,
    private matSnack: MatSnackBar,
    private bookService: BookService,
    private subjectService: SubjectService,
    private authorService: AuthorService,
  ) {
    this.element = new Livro();

    this.filteredAuthors = this.authorCtrl.valueChanges.pipe(
      startWith(null),
      map((althor: string | null) =>
        althor ? this._filterAuthor(althor) : this.allAuthors.slice(),
      ),
    );

    this.filteredSubjects = this.subjectCtrl.valueChanges.pipe(
      startWith(null),
      map((subj: string | null) =>
        subj ? this._filterSubject(subj) : this.allSubjects.slice(),
      ),
    );
  }
  async addAuthor(event: MatChipInputEvent) {
    const value = (event.value || "").trim();
    const hasAuthorInBook = this.element.autores?.some(
      (author: any) => author.nome === value,
    );
    if (hasAuthorInBook) {
      event.chipInput!.clear();
      this.authorCtrl.setValue(null);
      return;
    }
    const hasAuthorInBD: any = this.allAuthors?.filter(
      (author: any) => author.nome === value,
    );
    console.log("hasAuthorInBD", hasAuthorInBD);
    if (hasAuthorInBD?.length > 0) {
      let author = hasAuthorInBD[0];
      delete author.livros;
      this.element.autores?.push(author);
    } else if (value) {
      let newAuthor: any = { nome: value };
      let authorSaved = await firstValueFrom(
        this.authorService.post(newAuthor),
      );
      this.element.autores?.push(authorSaved);
    }
    event.chipInput!.clear();
    this.authorCtrl.setValue(null);

    this.save();
  }

  async addSubject(event: MatChipInputEvent) {
    const value = (event.value || "").trim();
    const hasSubjectInBook = this.element.assuntos?.some(
      (subj: any) => subj.descricao === value,
    );
    if (hasSubjectInBook) {
      event.chipInput!.clear();
      this.subjectCtrl.setValue(null);
      return;
    }
    const hasSubjectInBD: any = this.allSubjects?.filter(
      (subj: any) => subj.descricao === value,
    );
    console.log("hasSubjectInBD", hasSubjectInBD);
    if (hasSubjectInBD?.length > 0) {
      let subj = hasSubjectInBD[0];
      delete subj.livros;
      this.element.autores?.push(subj);
    } else if (value) {
      let newSubject: any = { nome: value };
      let subjectSaved = await firstValueFrom(
        this.authorService.post(newSubject),
      );
      this.element.assuntos?.push(subjectSaved);
    }
    event.chipInput!.clear();
    this.subjectCtrl.setValue(null);

    this.save();
  }

  removeAuthor(author: string): void {
    const index = this.element.autores?.indexOf(author);
    if (index >= 0) {
      this.element.autores?.splice(index, 1);
      this.filterAuthors();
      this.announcer.announce(`Removed ${author}`);
    }
  }

  removeSubject(author: string): void {
    const index = this.element.assuntos?.indexOf(author);
    if (index >= 0) {
      this.element.assuntos?.splice(index, 1);
      this.filterSubjects();
      this.announcer.announce(`Removed ${author}`);
    }
  }

  selectedAuthor(event: MatAutocompleteSelectedEvent): void {
    const selectedItem = this.allAuthors.filter(
      (author) => author.nome === event.option.viewValue,
    );

    if (selectedItem?.length > 0) {
      this.element.autores?.push(selectedItem[0]);
      console.log(
        "event.option.viewValue",
        event.option.viewValue,
        selectedItem,
        this.element.autores,
      );
      this.authorInput.nativeElement.value = "";
      this.authorCtrl.setValue(null);
      this.filterAuthors();
    }
  }

  private _filterAuthor(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allAuthors
      .filter((author) => author.nome.toLowerCase().includes(filterValue))
      .map((author) => author.nome);
  }
  private _filterSubject(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSubjects
      .filter((subject) =>
        subject.descricao.toLowerCase().includes(filterValue),
      )
      .map((subj) => subj.descricao);
  }
  element: Livro | any;
  allAuthors: Autor[] = [];
  allSubjects: Assunto[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentAuthor = model("");
  readonly selectedAuthors = signal<Autor[]>([]);

  subjects: Assunto[] = [];

  form = new FormGroup({
    titulo: new FormControl("", [Validators.required, Validators.minLength(3)]),
    editora: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
    ]),
    edicao: new FormControl(null, [Validators.required, Validators.min(1)]),
    anoPublicacao: new FormControl("", [
      Validators.required,
      Validators.pattern("^(1[0-9]{3}|20[0-2][0-9]|202[0-5])$"),
    ]),
    valor: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    autores: new FormControl([] as Autor[], Validators.required),
    assuntos: new FormControl([] as Assunto[], Validators.required),
  });

  readonly announcer = inject(LiveAnnouncer);

  filterAuthors() {
    const idAuthorsSet = new Set(
      this.element.autores.map((author: any) => author.id),
    );

    const filteredItems = this.allAuthors.filter((author) => {
      return !idAuthorsSet.has(author.id);
    });
    this.filteredAuthors = this.authorCtrl.valueChanges.pipe(
      startWith(null),
      map((althor: string | null) =>
        althor ? this._filterAuthor(althor) : filteredItems.slice(),
      ),
    );
  }

  filterSubjects() {
    const idSubjectsSet = new Set(
      this.element.assuntos.map((sub: any) => sub.id),
    );

    const filteredItems = this.allSubjects.filter((sub) => {
      return !idSubjectsSet.has(sub.id);
    });
    this.filteredAuthors = this.authorCtrl.valueChanges.pipe(
      startWith(null),
      map((althor: string | null) =>
        althor ? this._filterSubject(althor) : filteredItems.slice(),
      ),
    );
  }

  async ngOnInit(): Promise<void> {
    await this.getAuthors();
    await this.getSubjects();

    this.active.params.subscribe((p) => this.getId(p["id"]));
  }

  async getId(uid: string): Promise<void> {
    if (uid === "new") {
      this.initForm();
      return;
    }
    try {
      const result = await firstValueFrom(this.bookService.id(uid));
      this.element = new Livro(result);

      this.initForm();
      this.filterItems();

      if (this.element.autores && this.element.autores.length > 0) {
        this.selectedAuthors.set(this.element.autores);
        this.form.controls.autores.setValue(this.selectedAuthors());
      }
    } catch (error) {
      console.error("Erro ao carregar livro:", error);
      this.matSnack.open("Erro ao carregar livro.", "Fechar", {
        duration: 3000,
      });
      this.router.navigateByUrl("/books");
    }
  }
  filterItems(): void {
    this.filterAuthors();
    this.filterSubjects();
  }

  initForm(): void {
    this.form.reset();
    this.form.patchValue({
      titulo: this.element.titulo,
      editora: this.element.editora,
      edicao: this.element.edicao,
      anoPublicacao: this.element.anoPublicacao,
      valor: this.element.valor,
      assuntos: this.element.assuntos || [],
    });

    this.form.controls.autores.setValue(this.selectedAuthors());
  }

  async getAuthors(): Promise<void> {
    try {
      const result = await firstValueFrom(this.authorService.all());
      this.allAuthors = result;
    } catch (error) {
      console.error("Erro ao carregar autores:", error);
      this.matSnack.open("Erro ao carregar autores.", "Fechar", {
        duration: 3000,
      });
    }
  }

  async getSubjects(): Promise<void> {
    try {
      const result = await firstValueFrom(this.subjectService.all());
      this.subjects = result;
    } catch (error) {
      console.error("Erro ao carregar assuntos:", error);
      this.matSnack.open("Erro ao carregar assuntos.", "Fechar", {
        duration: 3000,
      });
    }
  }

  async save(): Promise<void> {
    this.form.controls.autores.setValue(this.selectedAuthors());
    this.form.controls.autores.markAsTouched();

    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        this.element = { ...this.element, ...this.form.value };

        let result: Livro;
        result = await firstValueFrom(this.bookService.save(this.element));

        if (result) {
          this.matSnack.open("Livro salvo com sucesso!", undefined, {
            duration: 3000,
          });

          if (!this.element.id) {
            this.element.id = result.id;
            console.log("Novo livro salvo com ID:", this.element.id);
            this.router.navigateByUrl(`/books/${this.element.id}`);
          } else {
            this.router.navigateByUrl("/books");
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

  voltar(): void {
    this.form.reset();
    this.location.back();
  }
}
