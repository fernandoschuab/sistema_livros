import { Routes } from "@angular/router";
import { BooksComponent } from "./pages/books/books.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home",
  },
  {
    path: "home",
    component: BooksComponent,
  },
];
