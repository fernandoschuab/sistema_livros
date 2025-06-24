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
  styleUrls: ["./book.component.scss"],
})
export class BookComponent implements OnInit {
  authorCtrl = new FormControl("");
  subjectCtrl = new FormControl("");
  filteredAuthors!: Observable<Autor[]>;
  filteredSubjects!: Observable<Assunto[]>;

  @ViewChild("authorInput") authorInput!: ElementRef<HTMLInputElement>;
  @ViewChild("subjectInput") subjectInput!: ElementRef<HTMLInputElement>;

  element: Livro | any = new Livro();

  allAuthors: Autor[] = [];
  allSubjects: Assunto[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

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
    autores: new FormControl([] as Autor[]),
    assuntos: new FormControl([] as Assunto[]),
  });

  private announcer = inject(LiveAnnouncer);

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private location: Location,
    private matSnack: MatSnackBar,
    private bookService: BookService,
    private subjectService: SubjectService,
    private authorService: AuthorService,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.active.params.subscribe((params) => {
      this.loadBook(params["id"]);
    });
  }

  private async loadData() {
    try {
      this.allAuthors = await firstValueFrom(this.authorService.all());
      this.allSubjects = await firstValueFrom(this.subjectService.all());
    } catch (error) {
      this.allAuthors = [];
      this.allSubjects = [];
      console.error("Erro ao carregar autores e assuntos", error);
    }
    this.setupFilters();
  }

  private setupFilters() {
    this.filteredAuthors = this.authorCtrl.valueChanges.pipe(
      startWith(""),
      map((value) =>
        value ? this.filterAuthors(value) : this.availableAuthors(),
      ),
    );
    this.filteredSubjects = this.subjectCtrl.valueChanges.pipe(
      startWith(""),
      map((value) =>
        value ? this.filterSubjects(value) : this.availableSubjects(),
      ),
    );
  }

  private availableAuthors(): Autor[] {
    const selectedIds = new Set(this.element.autores.map((a: any) => a.id));
    return this.allAuthors.filter((a) => !selectedIds.has(a.id));
  }

  private availableSubjects(): Assunto[] {
    const selectedIds = new Set(this.element.assuntos.map((s: any) => s.id));
    return this.allSubjects.filter((s) => !selectedIds.has(s.id));
  }

  private filterAuthors(value: string): Autor[] {
    const filterValue = value.toLowerCase();
    return this.availableAuthors().filter((author) =>
      author.nome.toLowerCase().includes(filterValue),
    );
  }

  private filterSubjects(value: string): Assunto[] {
    const filterValue = value.toLowerCase();
    return this.availableSubjects().filter((subj) =>
      subj.descricao.toLowerCase().includes(filterValue),
    );
  }

  async loadBook(id: string) {
    if (id === "new") {
      this.element = new Livro();
      this.initForm();
      return;
    }
    try {
      const book = await firstValueFrom(this.bookService.id(id));
      if (book) {
        this.element = book;
        if (!this.element.autores) this.element.autores = [];
        if (!this.element.assuntos) this.element.assuntos = [];
      }
      this.initForm();
      this.setupFilters();
    } catch (error) {
      console.error("Erro ao carregar livro:", error);
      this.matSnack.open("Erro ao carregar livro.", "Fechar", {
        duration: 3000,
      });
      this.router.navigateByUrl("/books");
    }
  }

  initForm() {
    this.form.reset();
    this.form.patchValue({
      titulo: this.element.titulo,
      editora: this.element.editora,
      edicao: this.element.edicao,
      anoPublicacao: this.element.anoPublicacao,
      valor: this.element.valor,
      autores: this.element.autores,
      assuntos: this.element.assuntos,
    });
  }

  async addAuthor(event: MatChipInputEvent) {
    const value = (event.value || "").trim();

    if (!value) return;

    const existsInBook = this.element.autores.some(
      (a: any) => a.nome === value,
    );
    if (existsInBook) {
      event.chipInput!.clear();
      this.authorCtrl.setValue(null);
      return;
    }

    const found = this.allAuthors.find((a) => a.nome === value);

    if (found) {
      this.element.autores.push(found);
    } else {
      // Criar novo autor
      const newAuthor: any = { nome: value };
      try {
        const saved = await firstValueFrom(this.authorService.post(newAuthor));
        this.element.autores.push(saved);
        this.allAuthors.push(saved);
      } catch (error) {
        console.error("Erro ao salvar autor", error);
        this.matSnack.open("Erro ao salvar autor.", "Fechar", {
          duration: 3000,
        });
      }
    }

    event.chipInput!.clear();
    this.authorCtrl.setValue(null);
    this.setupFilters();
    this.save();
  }

  async addSubject(event: MatChipInputEvent) {
    const value = (event.value || "").trim();

    if (!value) return;

    const existsInBook = this.element.assuntos.some(
      (s: any) => s.descricao === value,
    );
    if (existsInBook) {
      event.chipInput!.clear();
      this.subjectCtrl.setValue(null);
      return;
    }

    const found = this.allSubjects.find((s) => s.descricao === value);

    if (found) {
      this.element.assuntos.push(found);
    } else {
      // Criar novo assunto
      const newSubject: any = { descricao: value };
      try {
        const saved = await firstValueFrom(
          this.subjectService.post(newSubject),
        );
        this.element.assuntos.push(saved);
        this.allSubjects.push(saved);
      } catch (error) {
        console.error("Erro ao salvar assunto", error);
        this.matSnack.open("Erro ao salvar assunto.", "Fechar", {
          duration: 3000,
        });
      }
    }

    event.chipInput!.clear();
    this.subjectCtrl.setValue(null);
    this.setupFilters();
    this.save();
  }

  removeAuthor(author: Autor) {
    const index = this.element.autores.indexOf(author);
    if (index >= 0) {
      this.element.autores.splice(index, 1);
      this.setupFilters();
      this.announcer.announce(`Removed ${author.nome}`);
      this.save();
    }
  }

  removeSubject(subj: Assunto) {
    const index = this.element.assuntos.indexOf(subj);
    if (index >= 0) {
      this.element.assuntos.splice(index, 1);
      this.setupFilters();
      this.announcer.announce(`Removed ${subj.descricao}`);
      this.save();
    }
  }

  selectedAuthor(event: MatAutocompleteSelectedEvent) {
    const selected = this.allAuthors.find(
      (a) => a.nome === event.option.viewValue,
    );
    if (
      selected &&
      !this.element.autores.some((a: any) => a.id === selected.id)
    ) {
      this.element.autores.push(selected);
      this.authorInput.nativeElement.value = "";
      this.authorCtrl.setValue(null);
      this.setupFilters();
      this.save();
    }
  }

  selectedSubject(event: MatAutocompleteSelectedEvent) {
    const selected = this.allSubjects.find(
      (s) => s.descricao === event.option.viewValue,
    );
    if (
      selected &&
      !this.element.assuntos.some((s: any) => s.id === selected.id)
    ) {
      this.element.assuntos.push(selected);
      this.subjectInput.nativeElement.value = "";
      this.subjectCtrl.setValue(null);
      this.setupFilters();
      this.save();
    }
  }

  async save() {
    this.form.controls.autores.setValue(this.element.autores);
    this.form.controls.assuntos.setValue(this.element.assuntos);
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      this.matSnack.open(
        "Por favor, preencha todos os campos obrigatórios corretamente.",
        "Fechar",
        { duration: 3000 },
      );
      return;
    }

    try {
      this.element = { ...this.element, ...this.form.value };
      const result = await firstValueFrom(this.bookService.save(this.element));
      if (result) {
        this.element = result;
        this.matSnack.open("Livro salvo com sucesso!", undefined, {
          duration: 3000,
        });
        this.router.navigateByUrl(`/livros`);
      }
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
      this.matSnack.open(
        "Erro ao salvar livro. Verifique os dados.",
        "Fechar",
        { duration: 3000 },
      );
    }
  }

  voltar() {
    this.form.reset();
    this.location.back();
  }
}
