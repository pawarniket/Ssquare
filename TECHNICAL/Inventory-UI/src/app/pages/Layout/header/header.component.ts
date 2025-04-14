import { Component } from '@angular/core';
import { UserService } from '../../../core/service/user/user.service';
import { Router } from '@angular/router';
declare var bootstrap: any; // Add this at the top

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
constructor(private  user :UserService,private router :Router){

}
  SignOut() {
    try {
      this.user.isAuthenticated = false;
      this.user.currentUser = null;
      this.user.currentUserID = null;
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }
  closeOffcanvas() {
    const offcanvasEl = document.getElementById('mobileMenu');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (offcanvas) {
      offcanvas.hide();
      
    }
}
}
