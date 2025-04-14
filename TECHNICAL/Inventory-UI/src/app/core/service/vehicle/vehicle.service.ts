import { Injectable } from '@angular/core';
import { MasterService } from '../master/master.service';
import { environment } from '../../../../environments/environment';
import { APIConstant } from '../../constant/APIConstant';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private masterService: MasterService) { }

  
  Getvehicle(val: any) {
    return this.masterService.post(environment.api + APIConstant.Vehicle.getvehicle, val)

  }
  Insertvehicle(val: any) {
    return this.masterService.post(environment.api + APIConstant.Vehicle.insertvehicle, val)

  }
  Updatevehicle(val: any) {
    return this.masterService.post(environment.api + APIConstant.Vehicle.Updatevehicle, val)

  }
}
