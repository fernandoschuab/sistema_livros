import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { Assunto } from "../models/assunto.model";

@Injectable({
  providedIn: "root",
})
export class SubjectService extends BaseService<Assunto> {
  constructor(http: HttpClient) {
    super("assuntos", http);
  }
}
