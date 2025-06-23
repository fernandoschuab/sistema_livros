import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

export abstract class BaseService<T> {
  urlBase: string = "";
  constructor(
    public url: string,
    public http: HttpClient,
  ) {
    this.urlBase = `${environment.URL_API}/${this.url}`;
  }
  public all(): Observable<any> {
    return this.http.get(this.urlBase);
  }
  id(uid: string): Observable<any> {
    return this.http.get(`${this.urlBase}/${uid}`);
  }
  public save(model: T | any): Observable<T> {
    if (model.id) {
      return this.http.put<T>(`${this.urlBase}/${model.id}`, model);
    } else {
      return this.http.post<T>(this.urlBase, model);
    }
  }
  public post(model: T): Observable<any> {
    return this.http.post(this.urlBase, model);
  }

  public put(model: T | any): Observable<any> {
    return this.http.put<T>(`${this.urlBase}/${model.id}`, model);
  }
  public delete(uid: string): Observable<any> {
    return this.http.delete(`${this.urlBase}/${uid}`);
  }
}
