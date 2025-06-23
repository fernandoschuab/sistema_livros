import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";

export abstract class BaseService<T> {
  urlBase: string = "";
  constructor(
    public url: string,
    public http: HttpClient,
  ) {
    this.urlBase = `${process.env["URL_API"]}/${this.url}`;
  }
  public all(): Observable<any> {
    return this.http.get(this.urlBase);
  }
  id(uid: string): Observable<any> {
    return this.http.get(`${this.urlBase}/${uid}`);
  }

  public post(model: T): Observable<any> {
    return this.http.post(this.urlBase, model);
  }
  public delete(uid: string): Observable<any> {
    return this.http.delete(`${this.urlBase}/${uid}`);
  }
}
