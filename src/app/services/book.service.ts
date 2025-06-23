import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Livro } from "../models/livro.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BookService extends BaseService<Livro> {
  constructor(http: HttpClient) {
    super("livros", http);
  }
}
