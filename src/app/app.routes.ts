import { Routes } from "@angular/router";
import { BooksComponent } from "./pages/books/books.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthorsComponent } from "./pages/authors/authors.component";
import { SubjectsComponent } from "./pages/subjects/subjects.component";

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
    path: "autores",
    component: AuthorsComponent,
  },
  {
    path: "assuntos",
    component: SubjectsComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
];
