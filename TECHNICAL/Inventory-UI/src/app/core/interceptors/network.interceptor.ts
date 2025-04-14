import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../service/Loader/loading.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  TotalRequest = 0;
  CompleteRequest = 0;
  constructor(private Loader :LoadingService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.Loader.show();
    this.TotalRequest ++;
    // console.log("Show")
    return next.handle(request).pipe(
      finalize(()=>{
        this.CompleteRequest++;
        if(this.CompleteRequest === this.TotalRequest){
          this.Loader.hide();
          // console.log(this.TotalRequest , this.CompleteRequest)
          // console.log("hide")
          this.CompleteRequest =0;
          this.TotalRequest = 0;
        }

      })
    );
  }
}
