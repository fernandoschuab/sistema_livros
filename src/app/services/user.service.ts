import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, Subject } from "rxjs";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.model";

export interface tokenStoreInterface {
  uid: string;
  attendantName: string;
}
@Injectable({
  providedIn: "root",
})
export class UserService extends BaseService<User> {
  private loginSubject = new Subject<boolean>();
  constructor(
    http: HttpClient,
    private router: Router,
  ) {
    super("user", http);
  }

  async login(email: string, password: string): Promise<Observable<any>> {
    return this.http.post(`${process.env["URL_API"]}/user/auth`, {
      email,
      password,
    });
  }

  configureLogin(obj: any): void {
    const { token, user } = obj.data?.message;
    localStorage.setItem("SistemaBiblioteca:token", token);
    localStorage.setItem("SistemaBiblioteca:user", JSON.stringify(user));
    this.loginSubject.next(this.isStaticLogged);
  }
  configureLogOff(url: string = ""): void {
    localStorage.removeItem("SistemaBiblioteca:token");

    localStorage.removeItem("SistemaBiblioteca:user");
    localStorage.removeItem("SistemaBiblioteca:permissions");
    this.loginSubject.next(this.isStaticLogged);

    this.router.navigateByUrl("/login");
  }

  myUser() {
    return localStorage.getItem("SistemaBiblioteca:user") || "";
  }
  get isLogged(): Observable<boolean> {
    return this.loginSubject.asObservable();
  }

  get isStaticLogged(): boolean {
    return !!localStorage.getItem("SistemaBiblioteca:token");
  }
}
