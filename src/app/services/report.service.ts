import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Livro } from "../models/livro.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportService extends BaseService<any> {
  constructor(http: HttpClient) {
    super("relatorios/livros", http);
  }

  getReportPdf() {
    return this.http.get(`${environment.URL_API}/relatorios/livros`, {
      responseType: "blob",
    });
  }
}
