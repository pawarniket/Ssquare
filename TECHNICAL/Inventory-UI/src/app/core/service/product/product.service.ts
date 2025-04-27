import { Injectable } from '@angular/core';
import { APIConstant } from '../../constant/APIConstant';
import { environment } from '../../../../environments/environment';
import { MasterService } from '../master/master.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private remainingToolsSubject = new BehaviorSubject<any>(null); // 🚀
  remainingTools$ = this.remainingToolsSubject.asObservable(); 
  constructor(private masterService : MasterService,private http: HttpClient) { }

  // checkRemainingTools(): Observable<any> {
  //   return this.http.post(environment.api+APIConstant.Products.getProduct, {}, { // <-- empty body
  //     headers: { 'X-Ignore-Interceptor': 'true' }    // <-- headers inside options
  //   }).pipe(
  //     tap((tools) => {
  //       this.remainingToolsSubject.next(tools);
  //     })
  //   );
  // }
  checkRemainingTools(): void {
    this.http.post(environment.api + APIConstant.Products.getProduct, {}, {
      headers: { 'X-Ignore-Interceptor': 'true' }  // <-- Add header to bypass the interceptor
    }).pipe(
      tap((tools) => {
        this.remainingToolsSubject.next(tools);  // Update the tools in the BehaviorSubject
      })
    ).subscribe();  // Subscribing directly here to trigger the request
  }
  
    AddProduct(val:any){
      return this.masterService.post(environment.api+APIConstant.Products.AddProducts,val)

    }
    
    UpdateProduct(val:any){
      return this.masterService.post(environment.api+APIConstant.Products.UpdateProducts,val)
    }

    getProduct(val:any){
      return this.masterService.post(environment.api+APIConstant.Products.getProduct,val)

    }
    deleteProduct(val:any){
      return this.masterService.post(environment.api+APIConstant.Products.deleteproduct,val)

    }

  }
