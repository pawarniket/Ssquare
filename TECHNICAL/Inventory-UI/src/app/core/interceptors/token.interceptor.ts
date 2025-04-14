import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import CryptoJS from 'crypto-js';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  public currentUser: any;
  public currentUserID: any; 
  
  private token: string | null = null;

  constructor() { }
 
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    //her we aslo check if use login or not then pass header
    //   if (isLoggedIn && isApiUrl) {
    //     request = request.clone({
    //         setHeaders: { Authorization: `Bearer ${account.token}` }
    //     });
    // }
    // if (this.currentUser) {
    //   this.currentUser = JSON.parse(this.decryptData(this.currentUser));
    //   console.log("Niket",this.currentUser);
      
    //   this.token = this.currentUser.Token;
    // }
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(this.decryptData(localStorage.getItem('currentUser')!));
      this.token = this.currentUser.Token; 
    }

    request = request.clone({
      setHeaders: {
        
        // "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        
        // Authorization: `Bearer ${"token"}`,

      }
    });
    return next.handle(request);
  }
  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'DAE123');
    return bytes.toString(CryptoJS.enc.Utf8);
}

}
