import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userToken = localStorage.getItem('id_token');
    if (userToken) {
      const modifiedReq = req.clone({
        headers: req.headers.set('x-access-token', `${userToken}`),
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
