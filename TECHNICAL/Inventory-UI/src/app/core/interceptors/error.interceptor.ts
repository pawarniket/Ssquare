import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
declare function Toastdisplay(type: any, title: any, message: any): any;


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          
          errorMsg = `Error: ${error.error.message}`;
        }
        else {
          
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;

          if(error.status == 401){
            this.router.navigate(['/login']);
            Toastdisplay("warning", "Session is expired.", " Please SignIn again.");

          }
        }
        
        return throwError(errorMsg);
      })
    )
  }
}
