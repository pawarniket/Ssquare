import { Injectable } from '@angular/core';
import { MasterService } from '../master/master.service';
import { environment } from '../../../../environments/environment';
import { APIConstant } from '../../constant/APIConstant';

@Injectable({
  providedIn: 'root'
})
export class ProductcategoryService {

  constructor(private masterService: MasterService) { }

  AddProductcategory(val: any) {
    return this.masterService.post(environment.api + APIConstant.Productcategories.AddProductscategory, val)

  }
  UpdateProductcategory(val: any) {
    return this.masterService.post(environment.api + APIConstant.Productcategories.UpdateProductscategory, val)

  }

  getProductcategory(val: any) {
    return this.masterService.post(environment.api + APIConstant.Productcategories.getProductCategory, val)
  }
  deleteProductcategory(val: any) {
    return this.masterService.post(environment.api + APIConstant.Productcategories.deleteProductCategory, val)
  }
}
