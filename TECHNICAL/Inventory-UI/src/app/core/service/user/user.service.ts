import { Injectable } from '@angular/core';
import { APIConstant } from '../../constant/APIConstant';
import { environment } from '../../../../environments/environment';
import { MasterService } from '../master/master.service';
import { secretKey } from '../../constant/secret';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public isAuthenticated = false; // this need to be false once login function work
  public currentUser: any;
  public currentUserID: any;
  public token: string | null = null;

  constructor(private masterService: MasterService) { }


  initializeUser() {
    try {
      this.currentUser = localStorage.getItem('currentUser');
    
      if (this.currentUser) {
        this.currentUser = JSON.parse(this.decryptData(this.currentUser));
        this.currentUserID = this.currentUser.UserID;
        console.log("this.currentUserID",this.currentUserID);

        this.token = this.currentUser.Token;
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    } catch (error) {
      this.isAuthenticated = false;
    }
  }

  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey.crypto);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, secretKey.crypto).toString();
  }


  LoginUser(val:any){
    return this.masterService.post(environment.api+APIConstant.Users.userlogin,val)

  }
}
