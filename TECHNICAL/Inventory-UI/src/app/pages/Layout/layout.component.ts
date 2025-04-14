import { Component } from '@angular/core';
import { UserService } from '../../core/service/user/user.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  userPermissions = [
    {
      MenuHeaderCaption: "Product",
      MenuHeaderURL: "Product",
      MenuIconPath:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
      MenuSubHeaderCaption: []
    },
    {
      MenuHeaderCaption: " Category",
      MenuHeaderURL: "Category",
      MenuIconPath: `<svg class="svg-icon" id="p-dash7" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
                              </svg>`,
      MenuSubHeaderCaption: [ ]
    },
    {
      MenuHeaderCaption: "Sales",
      MenuHeaderURL: "SaleDetails",
      MenuIconPath: `<svg class="svg-icon" id="p-dash4" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                              </svg>`,
      MenuSubHeaderCaption: []
    },
    {
      MenuHeaderCaption: "LowStock/Outofstock",
      MenuHeaderURL: "LowStock",
      MenuIconPath:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 3v18h18v-2H5V3H3zm16 4.41l-4.29 4.3-3-3L7 14l1.41 1.41 3.3-3.29 3 3L21 9.83V16h2V6h-10v2h6z"/>
  </svg>`,
      MenuSubHeaderCaption: [
        {
          MenuSubHeaderCaption: "User Management",
          MenuSubHeaderURL: "settings/users"
        },
        {
          MenuSubHeaderCaption: "Roles",
          MenuSubHeaderURL: "settings/roles"
        }
   
   
      ]
    }
,

    {
      MenuHeaderCaption: "Client Details",
      MenuHeaderURL: "ClientDetails",
      MenuIconPath: `<svg class="svg-icon" id="p-dash4" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                              </svg>`,
      MenuSubHeaderCaption: []
    }
  ];
  
    usermenuList: any = [];
  currentUser: any;
  UserRoleID: any;
  UserName: any;
  profilePic: any;
  loading: any;
constructor(private  user :UserService,private router :Router,    private sanitizer:DomSanitizer
){

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

  ActivatedTab:any;


  changeSubMenus( MenuHeaderCaption: any) {
    this.ActivatedTab= MenuHeaderCaption;
    console.log(this.ActivatedTab);
  }
  getSanitizedSvgPath(iconPath: string) {
    return this.sanitizer.bypassSecurityTrustHtml(iconPath);

  }

  
}

