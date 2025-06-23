import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { Autor } from "../models/autor.model";

@Injectable({
  providedIn: "root",
})
export class AuthorService extends BaseService<Autor> {
  constructor(http: HttpClient) {
    super("autores", http);
  }
}
