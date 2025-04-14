import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree , Router} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service/user/user.service';

declare function Toastdisplay(type: any, title: any, message: any): any;


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  constructor(public router: Router, private service: UserService) { }
  
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    try {
      const expectedRole = next.data['expectedRole'];
      let currentUser: any = localStorage.getItem('currentUser');
      if (currentUser) {
        currentUser = JSON.parse(this.service.decryptData(currentUser));
        if (currentUser && currentUser.RoleID == expectedRole) {

          return true;
        }
        else if(currentUser && currentUser.RoleID  && expectedRole==undefined ){
          return true;
        }
        else {
          Toastdisplay("warning", "Login", "You are not authorized to access this page.");
          
          return false;
        }
      }
      this.service.isAuthenticated = false;
      this.router.navigate(['/login']);
      return false;

    }
    catch (error) {
      this.service.isAuthenticated = false;
      this.router.navigate(['/login']);
      return false;
    }

  }
}
