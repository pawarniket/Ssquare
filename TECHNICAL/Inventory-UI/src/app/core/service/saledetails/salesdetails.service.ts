import { Injectable } from '@angular/core';
import { APIConstant } from '../../constant/APIConstant';
import { environment } from '../../../../environments/environment';
import { MasterService } from '../master/master.service';
@Injectable({
  providedIn: 'root'
})
export class SalesdetailsService {

  constructor(private masterService : MasterService) { }


  Addsales(val:any){
    return this.masterService.post(environment.api+APIConstant.sales.insertsales,val)

  }
  
  Updatesales(val:any){
    return this.masterService.post(environment.api+APIConstant.sales.Updatesales,val)
  }

  getsales(val:any){
    return this.masterService.post(environment.api+APIConstant.sales.getsales,val)

  }
  deletesales(val:any){
    return this.masterService.post(environment.api+APIConstant.sales.deletesales,val)

  }
}
