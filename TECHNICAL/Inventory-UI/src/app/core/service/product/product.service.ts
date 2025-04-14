import { Injectable } from '@angular/core';
import { APIConstant } from '../../constant/APIConstant';
import { environment } from '../../../../environments/environment';
import { MasterService } from '../master/master.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private masterService : MasterService) { }


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
