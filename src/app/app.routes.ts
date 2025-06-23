import { Routes } from "@angular/router";
import { BooksComponent } from "./pages/books/books.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthorsComponent } from "./pages/authors/authors.component";
import { SubjectsComponent } from "./pages/subjects/subjects.component";
import { BookComponent } from "./pages/book/book.component";
import { AuthorComponent } from "./pages/author/author.component";
import { SubjectComponent } from "./pages/subject/subject.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/livros",
  },
  {
    path: "livros",
    component: BooksComponent,
  },
  {
    path: "livro/:id",
    component: BookComponent,
  },
  {
    path: "autores",
    component: AuthorsComponent,
  },
  {
    path: "autor/:id",
    component: AuthorComponent,
  },
  {
    path: "assuntos",
    component: SubjectsComponent,
  },
  {
    path: "assunto/:id",
    component: SubjectComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  { path: "**", pathMatch: "full", redirectTo: "/livros" },
];
