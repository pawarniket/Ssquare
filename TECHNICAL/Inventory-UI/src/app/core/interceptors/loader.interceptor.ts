import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../service/Loader/loader.service';

@Injectable()

export class loaderInterceptor implements HttpInterceptor {

  TotalRequest = 0;
  CompleteRequest = 0;
  constructor(private Loader :LoaderService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.Loader.show();
    this.TotalRequest ++;
    return next.handle(request).pipe(
      finalize(()=>{
        this.CompleteRequest++;
        if(this.CompleteRequest === this.TotalRequest){
          this.Loader.hide();
          this.CompleteRequest =0;
          this.TotalRequest = 0;
        }

      })
    );
  }
};
