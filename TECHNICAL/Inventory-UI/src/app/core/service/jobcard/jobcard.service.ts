import { Injectable } from '@angular/core';
import { MasterService } from '../master/master.service';
import { environment } from '../../../../environments/environment';
import { APIConstant } from '../../constant/APIConstant';
@Injectable({
  providedIn: 'root'
})
export class JobcardService {

 constructor(private masterService: MasterService) { }
 
   
   GetJobCard(val: any) {
     return this.masterService.post(environment.api + APIConstant.JobCard.getJobCard, val)
 
   }
   InsertJobCard(val: any) {
     return this.masterService.post(environment.api + APIConstant.JobCard.insertJobCard, val)
 
   }
   UpdateJobCard(val: any) {
     return this.masterService.post(environment.api + APIConstant.JobCard.UpdateJobCard, val)
   }
   JobcardProductDelete(val: any) {
    return this.masterService.post(environment.api + APIConstant.JobCard.DeleteJobCardProduct, val)
  }
}
