import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  
  constructor(private http: HttpClient) { }

  get(url: string, val: any): Observable<any> {
    return this.http.get(url);
  }

  post(url: string, val: any): Observable<any> {
    return this.http.post(url, val);
  }
//   delete(url: string): Observable<any> {
//     return this.http.delete(url);
// }
delete(url: string): Observable<any> {
  return this.http.post(url,{});
}
}
