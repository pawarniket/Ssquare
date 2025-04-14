import { Injectable } from '@angular/core';
import { MasterService } from '../master/master.service';
import { environment } from '../../../../environments/environment';
import { APIConstant } from '../../constant/APIConstant';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private masterService : MasterService) { }

      AddClient(val:any){
        return this.masterService.post(environment.api+APIConstant.Client.insertclient,val)
  
      }
      UpdateClient(val:any){
        return this.masterService.post(environment.api+APIConstant.Client.Updateclient,val)
  
      }
     GetClient(val:any){
        return this.masterService.post(environment.api+APIConstant.Client.getClient,val)
  
      }
}
