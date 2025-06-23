// http-request.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpResponse,
  HttpHeaders,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { EMPTY, throwError } from "rxjs";
import { catchError, retry, tap } from "rxjs/operators";
import Swal from "sweetalert2";

export const HttpRequestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const createHeaders = (): HttpHeaders => {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Access-Control-Allow-Origin", "*");
    headers = headers.append("Access-Control-Allow-Headers", "Content-Type");
    headers = headers.append(
      "Access-Control-Allow-Methods",
      "GET,POST,OPTIONS,DELETE,PUT",
    );

    headers = headers.append("Accept", "application/json");

    return headers;
  };

  // Create the headers using the helper function
  const headers = createHeaders();

  // Clone the request with the new headers
  const clonedReq = req.clone({
    headers: headers,
  });
  return next(clonedReq).pipe(
    retry(1),
    tap((event) => {
      if (event instanceof HttpResponse) {
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        Swal.fire(
          "Erro de Conexão",
          "Não foi possível conectar ao servidor. Verifique se o backend está ativo e acessível.",
          "error",
        );

        return EMPTY;
      }
      if (error.status === 401) {
        router.navigate(["/login"]);
        userService.configureLogOff();
        return EMPTY;
      }

      if (error.status === 403) {
        Swal.fire(
          "Atenção",
          "Você não tem permissão para acessar este recurso.",
          "warning",
        );
        userService.configureLogOff();
        return EMPTY;
      }
      if (error.status === 500) {
        Swal.fire("Erro", "Ocorreu um erro interno no servidor.", "error");
        userService.configureLogOff();
        return EMPTY;
      }

      return throwError(() => error);
    }),
  );
};
